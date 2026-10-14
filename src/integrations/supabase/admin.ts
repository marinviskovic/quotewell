import { createClient } from "@supabase/supabase-js";

// Admin client so deletes always work
export const supabaseAdmin = createClient(
  "https://qwlxkzpmnbrtvcyhd.supabase.co",
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
);
