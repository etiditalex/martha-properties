export function adminPath(...segments: string[]): string {
  const rest = segments
    .map((segment) => segment.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
  return rest ? `/admin/${rest}` : "/admin";
}
