import { createBrowserClient } from "@supabase/ssr";

type PublicSupabaseConfig = {
  url: string;
  anonKey: string;
};

function readBrowserConfig(): PublicSupabaseConfig {
  return {
    url: (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim(),
    anonKey: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim(),
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = readBrowserConfig();
  return Boolean(url && anonKey);
}

export function createClient() {
  const { url, anonKey } = readBrowserConfig();
  return createBrowserClient(url, anonKey);
}
