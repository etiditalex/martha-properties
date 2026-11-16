import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export default function SupabaseBrowserConfig() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey || anonKey.startsWith("sb_secret_")) return null;

  const payload = JSON.stringify({ url, anonKey }).replace(/</g, "\\u003c");

  return (
    <script
      id="martha-supabase-config"
      dangerouslySetInnerHTML={{
        __html: `window.__MARTHA_SUPABASE__=${payload};`,
      }}
    />
  );
}
