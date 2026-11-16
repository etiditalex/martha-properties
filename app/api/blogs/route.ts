import { NextResponse } from "next/server";
import { getPublishedBlogs } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getPublishedBlogs();
  return NextResponse.json(result);
}
