import { NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/server";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const phone = String(body?.phone || "").trim();
  const preferredDate = String(body?.preferredDate || "").trim();
  const preferredTime = String(body?.preferredTime || "").trim();
  const propertyName = String(body?.propertyName || "").trim();
  const message = String(body?.message || "").trim();

  if (!name || !email || !phone) {
    return NextResponse.json({ error: "Name, email, and phone are required." }, { status: 400 });
  }

  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ ok: true, saved: false });
  }

  const supabase = createAnonClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, saved: false });
  }

  const { error } = await supabase.from("bookings").insert({
    name,
    email,
    phone,
    preferred_date: preferredDate || null,
    preferred_time: preferredTime || null,
    property_name: propertyName || null,
    message: message || null,
  });

  if (error) {
    return NextResponse.json({ error: "The booking could not be saved." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, saved: true });
}
