import { createClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseServerConfigured } from "@/lib/supabase/env";

export function createAnonClient() {
  if (!isSupabaseServerConfigured()) return null;
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
