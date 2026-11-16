"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, MessageSquare, Calendar, ArrowRight, Building2, Newspaper, Quote } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import StatCard from "@/components/admin/StatCard";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Booking, DashboardStats, Inquiry } from "@/lib/supabase/types";
import { formatAdminDate } from "@/lib/admin/utils";
import { adminPath } from "@/lib/admin/path";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    listings: 0,
    availableListings: 0,
    blogs: 0,
    newInquiries: 0,
    newBookings: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }
      const supabase = createClient();

      const [
        { count: listings },
        { count: available },
        { count: blogs },
        { count: newInq },
        { count: newBookings },
        { data: inquiries },
        { data: bookings },
      ] = await Promise.all([
        supabase.from("listings").select("*", { count: "exact", head: true }),
        supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "available"),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        listings: listings || 0,
        availableListings: available || 0,
        blogs: blogs || 0,
        newInquiries: newInq || 0,
        newBookings: newBookings || 0,
      });
      setRecentInquiries((inquiries as Inquiry[]) || []);
      setRecentBookings((bookings as Booking[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const quickActions = [
    { href: adminPath("listings/new"), label: "Add Listing", icon: MapPin },
    { href: adminPath("inquiries"), label: "View Inquiries", icon: MessageSquare },
    { href: adminPath("bookings"), label: "Manage Bookings", icon: Calendar },
    { href: adminPath("reviews"), label: "Reviews", icon: Quote },
  ];

  return (
    <AdminShell title="Dashboard" subtitle="Overview of Martha Properties listings and bookings">
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent/40 border-t-accent" />
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Listings" value={stats.listings} icon={Building2} delay={0} />
            <StatCard
              title="Available Listings"
              value={stats.availableListings}
              icon={MapPin}
              gradient="from-emerald-700 to-emerald-900"
              delay={0.1}
            />
            <StatCard title="Blog Posts" value={stats.blogs} icon={Newspaper} delay={0.2} />
            <StatCard
              title="New Bookings"
              value={stats.newBookings}
              change={`${stats.newInquiries} new inquiries`}
              icon={Calendar}
              delay={0.3}
            />
          </div>

          <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.href}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    href={action.href}
                    className="group flex items-center gap-3 rounded-2xl border border-primary/10 bg-white p-4 shadow-sm transition hover:border-accent hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-accent">
                      <Icon size={18} />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-primary">{action.label}</span>
                    <ArrowRight
                      size={16}
                      className="text-primary/30 transition group-hover:translate-x-0.5 group-hover:text-accent"
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-primary">Recent Inquiries</h3>
                <Link href={adminPath("inquiries")} className="text-xs font-medium text-primary/70 hover:text-accent">
                  View all
                </Link>
              </div>
              {recentInquiries.length === 0 ? (
                <p className="py-8 text-center text-sm text-primary/40">No inquiries yet</p>
              ) : (
                <div className="space-y-3">
                  {recentInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="flex items-start justify-between rounded-xl border border-primary/10 bg-martha-sand/70 p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-primary">{inq.name}</p>
                        <p className="text-xs text-primary/55">{inq.subject || inq.email}</p>
                      </div>
                      <span className="text-[10px] text-primary/40">{formatAdminDate(inq.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-primary">Recent Bookings</h3>
                <Link href={adminPath("bookings")} className="text-xs font-medium text-primary/70 hover:text-accent">
                  View all
                </Link>
              </div>
              {recentBookings.length === 0 ? (
                <p className="py-8 text-center text-sm text-primary/40">No bookings yet</p>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-start justify-between rounded-xl border border-primary/10 bg-martha-sand/70 p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-primary">{booking.name}</p>
                        <p className="text-xs text-primary/55">
                          {booking.property_name || "Viewing request"} · {booking.phone}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          booking.status === "new" ? "bg-accent-blend text-primary" : "bg-primary/10 text-primary/70"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
