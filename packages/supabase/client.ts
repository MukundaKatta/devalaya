import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function createSupabaseClient(
  supabaseUrl: string,
  supabaseKey: string
) {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

export function createSupabaseServerClient(
  supabaseUrl: string,
  supabaseServiceKey: string
) {
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export type SupabaseClient = ReturnType<typeof createSupabaseClient>;
export type SupabaseServerClient = ReturnType<typeof createSupabaseServerClient>;
