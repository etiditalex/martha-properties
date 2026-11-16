import type { Metadata } from "next";
import { AdminShellProvider } from "@/components/admin/AdminShellContext";
import SupabaseBrowserConfig from "@/components/SupabaseBrowserConfig";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Martha Properties Console" },
  alternates: { canonical: "/admin" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SupabaseBrowserConfig />
      <AdminShellProvider configured={isSupabaseServerConfigured()}>{children}</AdminShellProvider>
    </>
  );
}
