import { createBrowserClient } from "@supabase/ssr";

type PublicSupabaseConfig = {
  url: string;
  anonKey: string;
};

declare global {
  interface Window {
    __MARTHA_SUPABASE__?: PublicSupabaseConfig;
  }
}

function readBrowserConfig(): PublicSupabaseConfig {
  const injected = typeof window !== "undefined" ? window.__MARTHA_SUPABASE__ : undefined;
  return {
    url: (injected?.url || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim(),
    anonKey: (injected?.anonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim(),
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
