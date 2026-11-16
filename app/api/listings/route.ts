import { NextResponse } from "next/server";
import { getPublishedListings } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getPublishedListings();
  return NextResponse.json(result);
}
