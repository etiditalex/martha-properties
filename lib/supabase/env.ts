function readEnv(names: readonly string[]): string {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return "";
}

export function getSupabaseUrl(): string {
  return readEnv(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"]);
}

export function getSupabaseAnonKey(): string {
  return readEnv([
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_ANON_KEY",
  ]);
}

export function isSupabaseServerConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}
