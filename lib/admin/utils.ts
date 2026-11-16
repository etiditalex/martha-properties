export type ClassValue = string | undefined | null | false;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatAdminDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function parsePriceAmount(price: string | null | undefined): number | null {
  if (!price) return null;
  const n = parseInt(price.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}
