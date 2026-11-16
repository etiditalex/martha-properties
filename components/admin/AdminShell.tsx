"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import { useAdminShell } from "./AdminShellContext";
import { cn } from "@/lib/admin/utils";
import type { Profile } from "@/lib/supabase/types";

type AdminShellProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
};

export default function AdminShell({ children, title, subtitle }: AdminShellProps) {
  const pathname = usePathname();
  const { collapsed, mobileOpen, setMobileOpen, configured } = useAdminShell();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [badges, setBadges] = useState({ inquiries: 0, bookings: 0 });

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  useEffect(() => {
    if (!configured && !isSupabaseConfigured()) return;
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (prof) {
        setProfile(prof as Profile);
      } else {
        setProfile({
          id: user.id,
          email: user.email ?? null,
          full_name: (user.user_metadata?.full_name as string) || null,
          avatar_url: null,
          role: "admin",
        });
      }

      const [{ count: inquiries }, { count: bookings }] = await Promise.all([
        supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "new"),
      ]);
      setBadges({ inquiries: inquiries || 0, bookings: bookings || 0 });
    }

    load();
  }, [configured]);

  return (
    <div className="min-h-screen bg-martha-cream">
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-primary/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <AdminSidebar badges={badges} logoUrl={profile?.avatar_url} />

      <AdminTopBar
        title={title}
        subtitle={subtitle}
        userName={profile?.full_name || undefined}
        userEmail={profile?.email || undefined}
        avatarUrl={profile?.avatar_url}
      />

      <main
        className={cn(
          "min-h-[calc(100vh-4rem)] p-4 transition-all duration-300 sm:p-6",
          collapsed ? "lg:ml-[72px]" : "lg:ml-64"
        )}
      >
        {!configured ? (
          <div className="mb-4 rounded-xl border border-accent/40 bg-accent-blend px-4 py-3 text-sm text-primary">
            Supabase is not connected on this deployment. In Vercel, set{" "}
            <span className="font-semibold">NEXT_PUBLIC_SUPABASE_URL</span> and{" "}
            <span className="font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> for Production, then redeploy.
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
