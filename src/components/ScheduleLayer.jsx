// ScheduleLayer.jsx
// Drop into src/components/ and import wherever you render habit tiers.
// Props:
//   completedHabits: Set<string>   — habit IDs already checked today
//   onToggleHabit: (id) => void    — toggle a habit completion
//   stepCount: number              — today's step count (pass in from your tracker)
//   onStepUpdate: (n) => void      — update step count

import { useState } from "react";
import {
  SCHEDULE_BLOCKS,
  PHASES,
  TIER_META,
  DAILY_STEP_GOAL,
  STEP_BLOCKS,
} from "../data/scheduleHabits";

// ─── tiny helpers ────────────────────────────────────────────────────────────

function pct(n, total) {
  return Math.min(100, Math.round((n / total) * 100));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// ─── sub-components ──────────────────────────────────────────────────────────

function StepsMeter({ stepCount, onStepUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(stepCount));
  const filled = pct(stepCount, DAILY_STEP_GOAL);

  function commit() {
    const n = parseInt(draft, 10);
    if (!isNaN(n) && n >= 0) onStepUpdate(n);
    setEditing(false);
  }

  return (
    <div className="steps-meter">
      <div className="steps-header">
        <span className="steps-icon">👟</span>
        <span className="steps-label">Daily steps</span>
        <span className="steps-goal">goal: {DAILY_STEP_GOAL.toLocaleString()}</span>
        {editing ? (
          <div className="steps-edit">
            <input
              type="number"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={e => e.key === "Enter" && commit()}
              autoFocus
              className="steps-input"
            />
          </div>
        ) : (
          <button className="steps-count" onClick={() => { setDraft(String(stepCount)); setEditing(true); }}>
            {stepCount.toLocaleString()} <span className="steps-edit-hint">✎</span>
          </button>
        )}
      </div>
      <div className="steps-track">
        <div
          className={`steps-fill ${filled >= 100 ? "complete" : ""}`}
          style={{ width: filled + "%" }}
        />
        {STEP_BLOCKS.map(b => {
          const pos = pct(b.target, DAILY_STEP_GOAL);
          return (
            <div key={b.id} className="step-tick" style={{ left: pos + "%" }} title={`${b.label}: +${b.target.toLocaleString()}`} />
          );
        })}
      </div>
      <div className="steps-breakdown">
        {STEP_BLOCKS.map(b => (
          <span key={b.id} className="step-pill">
            {b.label.split(" ")[0]} +{(b.target / 1000).toFixed(0)}k
          </span>
        ))}
        <span className="step-pill bonus">bonus ~1k</span>
      </div>
    </div>
  );
}

function HabitCheck({ habit, checked, onToggle }) {
  const meta = TIER_META[habit.tier];
  return (
    <button
      className={`habit-check ${checked ? "checked" : ""}`}
      onClick={() => onToggle(habit.id)}
      style={{ "--tier-color": meta.color, "--tier-bg": meta.bg }}
      aria-pressed={checked}
    >
      <span className="habit-tick">{checked ? "✓" : "○"}</span>
      <span className="habit-label">{habit.label}</span>
      <span className="habit-tier-dot" style={{ background: meta.color }} title={meta.label} />
    </button>
  );
}

function BlockCard({ block, completedHabits, onToggleHabit }) {
  const [open, setOpen] = useState(false);
  const meta = TIER_META[block.tier];
  const doneCount = block.habits.filter(h => completedHabits.has(h.id)).length;
  const allDone = doneCount === block.habits.length;

  return (
    <div
      className={`block-card ${block.tier} ${allDone ? "all-done" : ""}`}
      style={{ "--tier-color": meta.color }}
    >
      <button className="block-header" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="block-icon" aria-hidden="true">{block.icon}</span>
        <div className="block-info">
          <span className="block-time">{block.time}</span>
          <span className="block-title">{block.title}</span>
          <span className="block-sub">{block.sub}</span>
        </div>
        <div className="block-right">
          <span className="block-progress" style={{ color: allDone ? meta.color : undefined }}>
            {doneCount}/{block.habits.length}
          </span>
          <span className="block-chevron">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="block-habits">
          {block.habits.map(h => (
            <HabitCheck
              key={h.id}
              habit={h}
              checked={completedHabits.has(h.id)}
              onToggle={onToggleHabit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PhaseSection({ phase, blocks, completedHabits, onToggleHabit }) {
  const phaseBlocks = blocks.filter(b => b.phase === phase);
  if (!phaseBlocks.length) return null;
  const total = phaseBlocks.flatMap(b => b.habits).length;
  const done = phaseBlocks.flatMap(b => b.habits).filter(h => completedHabits.has(h.id)).length;

  return (
    <section className="phase-section">
      <div className="phase-header">
        <span className="phase-label">{phase}</span>
        <span className="phase-score">{done}/{total}</span>
      </div>
      {phaseBlocks.map(b => (
        <BlockCard
          key={b.id}
          block={b}
          completedHabits={completedHabits}
          onToggleHabit={onToggleHabit}
        />
      ))}
    </section>
  );
}

// ─── DaySummary bar ──────────────────────────────────────────────────────────

function DaySummary({ completedHabits, stepCount }) {
  const allHabits = SCHEDULE_BLOCKS.flatMap(b => b.habits);
  const totalHabits = allHabits.length;
  const doneHabits = allHabits.filter(h => completedHabits.has(h.id)).length;
  const stepsOk = stepCount >= DAILY_STEP_GOAL;

  const byTier = Object.keys(TIER_META).map(tier => {
    const habits = allHabits.filter(h => h.tier === tier);
    const done = habits.filter(h => completedHabits.has(h.id)).length;
    return { tier, done, total: habits.length, ...TIER_META[tier] };
  });

  return (
    <div className="day-summary">
      <div className="summary-row">
        {byTier.map(t => (
          <div key={t.tier} className="summary-cell" style={{ "--tc": t.color, "--tbg": t.bg }}>
            <span className="summary-tier-label">{t.label}</span>
            <span className="summary-tier-score">{t.done}/{t.total}</span>
          </div>
        ))}
        <div className="summary-cell" style={{ "--tc": stepsOk ? "#1D9E75" : "#888", "--tbg": stepsOk ? "#E1F5EE" : "#F1EFE8" }}>
          <span className="summary-tier-label">Steps</span>
          <span className="summary-tier-score">{stepsOk ? "✓" : `${Math.round(stepCount / 1000)}k`}</span>
        </div>
      </div>
      <div className="summary-bar-wrap">
        <div className="summary-bar">
          <div className="summary-fill" style={{ width: pct(doneHabits, totalHabits) + "%" }} />
        </div>
        <span className="summary-pct">{pct(doneHabits, totalHabits)}% complete</span>
      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function ScheduleLayer({
  completedHabits = new Set(),
  onToggleHabit = () => {},
  stepCount = 0,
  onStepUpdate = () => {},
}) {
  return (
    <div className="schedule-layer">
      <DaySummary completedHabits={completedHabits} stepCount={stepCount} />
      <StepsMeter stepCount={stepCount} onStepUpdate={onStepUpdate} />
      {PHASES.map(phase => (
        <PhaseSection
          key={phase}
          phase={phase}
          blocks={SCHEDULE_BLOCKS}
          completedHabits={completedHabits}
          onToggleHabit={onToggleHabit}
        />
      ))}
    </div>
  );
}
