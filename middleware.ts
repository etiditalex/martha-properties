import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (!isSupabaseServerConfigured()) {
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
