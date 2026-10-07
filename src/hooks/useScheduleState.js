import { useState, useEffect, useCallback } from "react";
import { ALL_SCHEDULE_HABITS } from "../data/scheduleHabits";
import { supabase } from "../lib/supabase";
import { dateKey } from "../lib/dateKey";

const STORAGE_KEY_PREFIX = "khroknows_schedule_";
const STEPS_KEY_PREFIX   = "khroknows_steps_";

function todayKey() {
  return dateKey();
}

// ─── localStorage helpers (cache / offline fallback) ─────────────────────────

function loadTodayCompletions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + todayKey());
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveTodayCompletions(set) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + todayKey(), JSON.stringify([...set]));
  } catch {}
}

function loadTodaySteps() {
  try {
    const raw = localStorage.getItem(STEPS_KEY_PREFIX + todayKey());
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

function saveTodaySteps(n) {
  try {
    localStorage.setItem(STEPS_KEY_PREFIX + todayKey(), String(n));
  } catch {}
}

function pruneOldEntries() {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffKey = dateKey(cutoff);
    for (const key of Object.keys(localStorage)) {
      if (
        (key.startsWith(STORAGE_KEY_PREFIX) || key.startsWith(STEPS_KEY_PREFIX)) &&
        key.split("_").pop() < cutoffKey
      ) {
        localStorage.removeItem(key);
      }
    }
  } catch {}
}

// ─── Supabase sync ───────────────────────────────────────────────────────────
// Table: schedule_days  (PK user_id + date; RLS limits rows to the signed-in user).
// Setup SQL lives in supabase-setup.sql at the repo root.

async function fetchFromSupabase(date) {
  try {
    const { data, error } = await supabase
      .from("schedule_days")
      .select("completed_habits, step_count")
      .eq("date", date)
      .maybeSingle();
    if (error || !data) return null;
    return {
      completedHabits: new Set(data.completed_habits ?? []),
      stepCount: data.step_count ?? 0,
    };
  } catch {
    return null;
  }
}

async function upsertToSupabase(userId, date, completedHabits, stepCount) {
  if (!userId) return;
  try {
    const { error } = await supabase.from("schedule_days").upsert(
      {
        user_id: userId,
        date,
        completed_habits: [...completedHabits],
        step_count: stepCount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,date" }
    );
    if (error) console.error("Crowknows sync failed:", error.message);
  } catch (err) {
    console.error("Crowknows sync failed:", err);
  }
}

// Call on sign-out so the next person on this browser doesn't see cached days.
export function clearLocalCache() {
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(STORAGE_KEY_PREFIX) || key.startsWith(STEPS_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // storage unavailable; nothing to clear
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useScheduleState(userId) {
  const [completedHabits, setCompletedHabits] = useState(() => loadTodayCompletions());
  const [stepCount, setStepCount] = useState(() => loadTodaySteps());

  // On mount: prune old entries, then hydrate from Supabase if available
  useEffect(() => {
    pruneOldEntries();
    const date = todayKey();
    fetchFromSupabase(date).then(remote => {
      if (!remote) return;
      // Merge: union of local + remote (keeps optimistic local state)
      setCompletedHabits(local => {
        const merged = new Set([...local, ...remote.completedHabits]);
        saveTodayCompletions(merged);
        return merged;
      });
      setStepCount(local => {
        const merged = Math.max(local, remote.stepCount);
        saveTodaySteps(merged);
        return merged;
      });
    });
  }, []);

  const toggleHabit = useCallback((id) => {
    setCompletedHabits(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveTodayCompletions(next);
      // fire-and-forget sync — stepCount needed, read from localStorage
      const steps = loadTodaySteps();
      upsertToSupabase(userId, todayKey(), next, steps);
      return next;
    });
  }, [userId]);

  const updateSteps = useCallback((n) => {
    const clamped = Math.max(0, Math.round(n));
    setStepCount(clamped);
    saveTodaySteps(clamped);
    setCompletedHabits(prev => {
      upsertToSupabase(userId, todayKey(), prev, clamped);
      return prev;
    });
  }, [userId]);

  const todayStats = {
    date: todayKey(),
    completed: completedHabits.size,
    total: ALL_SCHEDULE_HABITS.length,
    stepCount,
    stepGoalMet: stepCount >= 10000,
    pct: Math.round((completedHabits.size / ALL_SCHEDULE_HABITS.length) * 100),
  };

  return { completedHabits, toggleHabit, stepCount, updateSteps, todayStats };
}

// ─── History helper ──────────────────────────────────────────────────────────

export function getScheduleHistoryStats(days = 7) {
  const results = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      const completed = raw ? JSON.parse(raw).length : 0;
      const steps = parseInt(localStorage.getItem(STEPS_KEY_PREFIX + key) || "0", 10);
      results.push({ date: key, completed, total: ALL_SCHEDULE_HABITS.length, steps });
    } catch {
      results.push({ date: key, completed: 0, total: ALL_SCHEDULE_HABITS.length, steps: 0 });
    }
  }
  return results.reverse();
}
