import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// False until both env vars are set (see .env.local.example). The app shows a
// setup notice instead of crashing when they are missing.
export const supabaseConfigured = Boolean(url && key);

export const supabase = supabaseConfigured ? createClient(url, key) : null;
