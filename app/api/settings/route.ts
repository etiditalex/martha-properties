import { NextResponse } from "next/server";
import { getSiteContact } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const contact = await getSiteContact();
  return NextResponse.json(contact);
}
