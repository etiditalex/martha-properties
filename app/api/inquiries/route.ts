import { NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/server";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const message = String(body?.message || "").trim();
  const phone = String(body?.phone || "").trim();
  const listingSlug = String(body?.listingSlug || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ ok: true, saved: false });
  }

  const supabase = createAnonClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, saved: false });
  }

  const { error } = await supabase.from("inquiries").insert({
    name,
    email,
    phone: phone || null,
    message,
    listing_slug: listingSlug || null,
    subject: listingSlug ? `Enquiry about ${listingSlug}` : "Website enquiry",
  });

  if (error) {
    return NextResponse.json({ error: "The message could not be saved." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, saved: true });
}
