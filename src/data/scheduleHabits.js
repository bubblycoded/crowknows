// scheduleHabits.js
// Drop into your existing Khroknows src/data/ folder.
// Each block maps to the daily schedule. Tier mirrors your existing
// Foundation / Deep Work / Pleasure system.

export const SCHEDULE_BLOCKS = [
  {
    id: "tapas",
    time: "6:00 – 7:00",
    title: "Tapas — the fire ritual",
    sub: "Journal · intention · Obsidian · Carnatic warmup",
    icon: "🔥",
    tier: "foundation",
    phase: "morning",
    durationMin: 60,
    habits: [
      { id: "tapas_journal", label: "Morning journal entry", tier: "foundation" },
      { id: "tapas_intention", label: "Set single priority for the day", tier: "foundation" },
      { id: "tapas_obsidian", label: "Obsidian canon entry or world note", tier: "deep_work" },
    ],
  },
  {
    id: "fuel_morning",
    time: "7:00 – 7:20",
    title: "Fuel up",
    sub: "Fruit bowl · 500ml water · no screens",
    icon: "🍎",
    tier: "foundation",
    phase: "morning",
    durationMin: 20,
    habits: [
      { id: "fuel_fruit", label: "Eat fruit (bowl or 2+ pieces)", tier: "foundation" },
      { id: "fuel_water_am", label: "500ml water before 8am", tier: "foundation" },
    ],
  },
  {
    id: "walk_morning",
    time: "7:20 – 8:00",
    title: "First walk — Nala loop",
    sub: "~3,000 steps · garden check · sunlight anchor",
    icon: "🐾",
    tier: "foundation",
    phase: "morning",
    durationMin: 40,
    stepTarget: 3000,
    habits: [
      { id: "walk_nala_am", label: "Morning walk with Nala (~3k steps)", tier: "foundation" },
      { id: "walk_sunlight", label: "Direct sunlight exposure", tier: "foundation" },
    ],
  },
  {
    id: "deep_work_1",
    time: "8:00 – 10:00",
    title: "Deep work I",
    sub: "Single priority: EB-1A · Bandi's Monster · novel · Claude cert",
    icon: "🧠",
    tier: "deep_work",
    phase: "morning",
    durationMin: 120,
    habits: [
      { id: "dw1_focused", label: "2hr deep work session (no task switching)", tier: "deep_work" },
      { id: "dw1_phone_away", label: "Phone in another room during sprint", tier: "foundation" },
    ],
  },
  {
    id: "break_movement",
    time: "10:00 – 10:20",
    title: "Movement break",
    sub: "Walk the block · water · fruit or nuts",
    icon: "🚶",
    tier: "foundation",
    phase: "morning",
    durationMin: 20,
    stepTarget: 2000,
    habits: [
      { id: "break_walk", label: "Walk outside (~2k steps)", tier: "foundation" },
      { id: "break_water_mid", label: "500ml water mid-morning", tier: "foundation" },
    ],
  },
  {
    id: "ford_work",
    time: "10:30 – 1:00",
    title: "Ford / career block",
    sub: "ISO 15118-20 · PnC depth · strategic positioning",
    icon: "⚡",
    tier: "foundation",
    phase: "midday",
    durationMin: 150,
    habits: [
      { id: "ford_done", label: "Ford work block completed", tier: "foundation" },
    ],
  },
  {
    id: "lunch",
    time: "1:00 – 1:30",
    title: "Lunch + rehydrate",
    sub: "Real food · 500ml water · step outside briefly",
    icon: "🥗",
    tier: "foundation",
    phase: "midday",
    durationMin: 30,
    stepTarget: 1000,
    habits: [
      { id: "lunch_real_food", label: "Cooked/real food (not processed)", tier: "foundation" },
      { id: "lunch_water", label: "500ml water with lunch", tier: "foundation" },
      { id: "lunch_steps", label: "Short walk after lunch (~1k steps)", tier: "foundation" },
    ],
  },
  {
    id: "deep_work_2",
    time: "2:00 – 4:00",
    title: "Build block",
    sub: "Khroknows · Empathy Project · Praanjaan · India EV",
    icon: "💻",
    tier: "deep_work",
    phase: "afternoon",
    durationMin: 120,
    habits: [
      { id: "dw2_focused", label: "2hr build session (one project only)", tier: "deep_work" },
    ],
  },
  {
    id: "body_hour",
    time: "4:00 – 5:00",
    title: "Body hour",
    sub: "Tennis or long Nala walk — not optional",
    icon: "🎾",
    tier: "foundation",
    phase: "afternoon",
    durationMin: 60,
    stepTarget: 3000,
    habits: [
      { id: "body_tennis_walk", label: "Tennis or long walk (~3k steps)", tier: "foundation" },
    ],
  },
  {
    id: "creative_evening",
    time: "5:30 – 7:30",
    title: "Creative / Praanjaan time",
    sub: "Music · painting · novel · photography with Jahnavi",
    icon: "🎵",
    tier: "pleasure",
    phase: "evening",
    durationMin: 120,
    habits: [
      { id: "creative_done", label: "Creative session (any medium)", tier: "pleasure" },
    ],
  },
  {
    id: "dinner",
    time: "7:30 – 8:00",
    title: "Dinner",
    sub: "500ml water with dinner",
    icon: "🍽️",
    tier: "foundation",
    phase: "evening",
    durationMin: 30,
    habits: [
      { id: "dinner_water", label: "500ml water with dinner", tier: "foundation" },
    ],
  },
  {
    id: "close_ritual",
    time: "9:00 – 9:30",
    title: "Close ritual",
    sub: "Obsidian log · tomorrow's priority · gratitude",
    icon: "🌙",
    tier: "foundation",
    phase: "evening",
    durationMin: 30,
    habits: [
      { id: "close_obsidian", label: "Obsidian daily log written", tier: "foundation" },
      { id: "close_priority", label: "Tomorrow's single priority set", tier: "foundation" },
      { id: "close_gratitude", label: "3 gratitude notes (voice or written)", tier: "pleasure" },
    ],
  },
];

// All individual habits flattened — plug these into your existing habit registry
export const ALL_SCHEDULE_HABITS = SCHEDULE_BLOCKS.flatMap(b => b.habits);

// Step targets per block — used by the steps tracker
export const STEP_BLOCKS = SCHEDULE_BLOCKS
  .filter(b => b.stepTarget)
  .map(b => ({ id: b.id, label: b.title, target: b.stepTarget }));

export const DAILY_STEP_GOAL = 10000;

export const PHASES = ["morning", "midday", "afternoon", "evening"];

export const TIER_META = {
  foundation: { label: "Foundation", color: "#D85A30", bg: "#FAECE7" },
  deep_work:  { label: "Deep Work",  color: "#1D9E75", bg: "#E1F5EE" },
  pleasure:   { label: "Pleasure",   color: "#D4537E", bg: "#FBEAF0" },
};
