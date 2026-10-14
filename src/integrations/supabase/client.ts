import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const DEMO = import.meta.env.VITE_DEMO_MODE === "true" || !url || !anonKey;

export const supabase = DEMO
  ? null
  : createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true } });
