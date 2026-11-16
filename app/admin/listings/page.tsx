"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, Download } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { ListingRow, ListingStatus } from "@/lib/supabase/types";
import { cn } from "@/lib/admin/utils";
import { adminPath } from "@/lib/admin/path";
import { LAND_LISTINGS } from "@/lib/listings";
import { listingToRow } from "@/lib/data/mappers";

const statusColors: Record<ListingStatus, string> = {
  available: "bg-emerald-100 text-emerald-800",
  reserved: "bg-accent-blend text-primary",
  sold: "bg-red-100 text-red-800",
};

export default function AdminListingsPage() {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");

  const load = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const { data } = await supabase.from("listings").select("*").order("id", { ascending: true });
    setListings((data as ListingRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this listing?")) return;
    const supabase = createClient();
    await supabase.from("listings").delete().eq("id", id);
    load();
  };

  const handleImport = async () => {
    if (!isSupabaseConfigured()) {
      setImportMessage("Connect Supabase before importing.");
      return;
    }
    if (
      !confirm(
        "Import the current Martha Properties listings into the dashboard? Listings with the same slug will be updated."
      )
    ) {
      return;
    }
    setImporting(true);
    setImportMessage("");
    const supabase = createClient();
    const { error } = await supabase.from("listings").upsert(
      LAND_LISTINGS.map((listing) => listingToRow(listing)),
      { onConflict: "slug" }
    );
    setImporting(false);
    if (error) {
      setImportMessage(error.message);
      return;
    }
    setImportMessage(`Imported ${LAND_LISTINGS.length} listings.`);
    await load();
  };

  const filtered = listings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(search.toLowerCase()) ||
      listing.location.toLowerCase().includes(search.toLowerCase()) ||
      listing.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell title="Land Listings" subtitle="Manage Martha Properties plots for sale">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" />
          <input
            type="search"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-primary/20 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-blend"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="secondary" onClick={handleImport} loading={importing}>
            <Download size={16} /> Import from website
          </AdminButton>
          <Link href={adminPath("listings/new")}>
            <AdminButton>
              <Plus size={16} /> Add Listing
            </AdminButton>
          </Link>
        </div>
      </div>

      {importMessage && (
        <div
          className={`mb-6 rounded-xl px-4 py-3 text-sm ${
            importMessage.toLowerCase().includes("fail") || importMessage.toLowerCase().includes("connect")
              ? "bg-red-50 text-red-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {importMessage}
        </div>
      )}

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent/40 border-t-accent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-primary/20 bg-white py-16 text-center">
          <p className="text-primary/60">No listings found</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <AdminButton size="sm" variant="secondary" onClick={handleImport} loading={importing}>
              <Download size={14} /> Import from website
            </AdminButton>
            <Link href={adminPath("listings/new")}>
              <AdminButton size="sm">Add your first listing</AdminButton>
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-primary/10 bg-primary/5">
              <tr>
                <th className="px-4 py-3 font-semibold text-primary/70">Property</th>
                <th className="hidden px-4 py-3 font-semibold text-primary/70 md:table-cell">Location</th>
                <th className="px-4 py-3 font-semibold text-primary/70">Price</th>
                <th className="px-4 py-3 font-semibold text-primary/70">Status</th>
                <th className="px-4 py-3 font-semibold text-primary/70">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {filtered.map((listing) => (
                <tr key={listing.id} className="transition hover:bg-accent-blend/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-primary/5">
                        {listing.image ? (
                          <Image src={listing.image} alt={listing.title} fill className="object-cover" unoptimized />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-semibold text-primary">{listing.title}</p>
                        <p className="text-xs text-primary/40">{listing.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-primary/70 md:table-cell">{listing.location}</td>
                  <td className="px-4 py-3 font-medium text-martha-warm">{listing.price}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-bold uppercase",
                        statusColors[listing.status]
                      )}
                    >
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={adminPath(`listings/${listing.id}`)}
                        className="rounded-lg p-1.5 text-primary/40 hover:bg-accent-blend hover:text-primary"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(listing.id)}
                        className="rounded-lg p-1.5 text-primary/40 hover:bg-red-100 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
