"use client";

import { useEffect, useState } from "react";
import { Calendar, CheckCircle, Clock, Mail, Phone, XCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { AdminTextarea } from "@/components/admin/AdminForm";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Booking, BookingStatus } from "@/lib/supabase/types";
import { cn, formatAdminDate } from "@/lib/admin/utils";

const statusOptions: BookingStatus[] = ["new", "contacted", "confirmed", "cancelled"];

const statusStyles: Record<BookingStatus, string> = {
  new: "bg-accent-blend text-primary",
  contacted: "bg-primary/10 text-primary",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

const timeLabels: Record<string, string> = {
  morning: "Morning (9am – 12pm)",
  afternoon: "Afternoon (12pm – 5pm)",
  evening: "Evening (5pm – 7pm)",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    let query = supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setBookings((data as Booking[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const updateStatus = async (id: string, status: BookingStatus) => {
    const supabase = createClient();
    await supabase.from("bookings").update({ status, notes }).eq("id", id);
    if (selected?.id === id) setSelected({ ...selected, status, notes });
    load();
  };

  return (
    <AdminShell title="Bookings" subtitle="Viewing requests from the Book a viewing page">
      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", ...statusOptions] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold capitalize transition",
              filter === status ? "bg-primary text-accent" : "bg-primary/10 text-primary/70 hover:bg-primary/15"
            )}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-2 lg:col-span-2">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent/40 border-t-accent" />
            </div>
          ) : bookings.length === 0 ? (
            <p className="py-12 text-center text-sm text-primary/40">No bookings yet</p>
          ) : (
            bookings.map((booking) => (
              <button
                key={booking.id}
                type="button"
                onClick={() => {
                  setSelected(booking);
                  setNotes(booking.notes || "");
                }}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition",
                  selected?.id === booking.id
                    ? "border-accent bg-accent-blend/50"
                    : "border-primary/10 bg-white hover:border-accent/50"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-primary">{booking.name}</p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                      statusStyles[booking.status]
                    )}
                  >
                    {booking.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-primary/55">{booking.property_name || "Viewing request"}</p>
                <p className="mt-1 flex items-center gap-1 text-[10px] text-primary/40">
                  <Clock size={10} /> {formatAdminDate(booking.created_at)}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-3">
          {selected ? (
            <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-primary">{selected.name}</h3>
                  <p className="text-sm text-primary/55">{selected.property_name || "Property not specified"}</p>
                </div>
                <span
                  className={cn("rounded-full px-3 py-1 text-xs font-bold uppercase", statusStyles[selected.status])}
                >
                  {selected.status}
                </span>
              </div>

              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 rounded-xl bg-primary/5 p-3 text-sm text-primary hover:bg-accent-blend"
                >
                  <Mail size={16} className="text-accent" /> {selected.email}
                </a>
                <a
                  href={`tel:${selected.phone}`}
                  className="flex items-center gap-2 rounded-xl bg-primary/5 p-3 text-sm text-primary hover:bg-accent-blend"
                >
                  <Phone size={16} className="text-accent" /> {selected.phone}
                </a>
                <div className="flex items-center gap-2 rounded-xl bg-primary/5 p-3 text-sm text-primary">
                  <Calendar size={16} className="text-accent" />
                  {selected.preferred_date || "Date flexible"}
                  {selected.preferred_time
                    ? ` · ${timeLabels[selected.preferred_time] || selected.preferred_time}`
                    : ""}
                </div>
              </div>

              {selected.message && (
                <div className="mb-6 rounded-xl bg-primary/5 p-4">
                  <p className="whitespace-pre-wrap text-sm text-primary/80">{selected.message}</p>
                </div>
              )}

              <AdminTextarea label="Internal notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />

              <div className="mt-4 flex flex-wrap gap-2">
                <AdminButton size="sm" onClick={() => updateStatus(selected.id, "contacted")}>
                  Mark contacted
                </AdminButton>
                <AdminButton size="sm" variant="secondary" onClick={() => updateStatus(selected.id, "confirmed")}>
                  <CheckCircle size={14} /> Confirm viewing
                </AdminButton>
                <AdminButton size="sm" variant="outline" onClick={() => updateStatus(selected.id, "cancelled")}>
                  <XCircle size={14} /> Cancel
                </AdminButton>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-64 items-center justify-center rounded-2xl border border-dashed border-primary/15 bg-white text-sm text-primary/40">
              Select a booking
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
