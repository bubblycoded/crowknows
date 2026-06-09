// useScheduleState.js
// Drop into src/hooks/ (or wherever your Khroknows hooks live).
// Persists today's schedule completions and step count to localStorage,
// keyed by date so it auto-resets each morning.
//
// Usage:
//   const { completedHabits, toggleHabit, stepCount, updateSteps } = useScheduleState();

import { useState, useEffect, useCallback } from "react";
import { ALL_SCHEDULE_HABITS } from "../data/scheduleHabits";

const STORAGE_KEY_PREFIX = "khroknows_schedule_";
const STEPS_KEY_PREFIX   = "khroknows_steps_";

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "2026-06-08"
}

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
  } catch { /* storage full — fail silently */ }
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

// Prune entries older than 30 days to avoid localStorage bloat
function pruneOldEntries() {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffKey = cutoff.toISOString().slice(0, 10);
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

export function useScheduleState() {
  const [completedHabits, setCompletedHabits] = useState(() => loadTodayCompletions());
  const [stepCount, setStepCount] = useState(() => loadTodaySteps());

  // Prune old entries once on mount
  useEffect(() => { pruneOldEntries(); }, []);

  const toggleHabit = useCallback((id) => {
    setCompletedHabits(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveTodayCompletions(next);
      return next;
    });
  }, []);

  const updateSteps = useCallback((n) => {
    const clamped = Math.max(0, Math.round(n));
    setStepCount(clamped);
    saveTodaySteps(clamped);
  }, []);

  // Stats helpers — useful for your existing 7-day view
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

// Helper to get historical schedule stats for your 7-day streak view
export function getScheduleHistoryStats(days = 7) {
  const results = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      const completed = raw ? JSON.parse(raw).length : 0;
      const steps = parseInt(localStorage.getItem(STEPS_KEY_PREFIX + key) || "0", 10);
      results.push({ date: key, completed, total: ALL_SCHEDULE_HABITS.length, steps });
    } catch {
      results.push({ date: key, completed: 0, total: ALL_SCHEDULE_HABITS.length, steps: 0 });
    }
  }
  return results.reverse(); // oldest first
}
