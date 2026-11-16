"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { AdminInput, AdminSelect, AdminTextarea, AdminToggle } from "@/components/admin/AdminForm";
import ImageUpload from "@/components/admin/ImageUpload";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { ListingRow, ListingStatus } from "@/lib/supabase/types";
import { adminPath } from "@/lib/admin/path";
import { parsePriceAmount, slugify } from "@/lib/admin/utils";

const emptyListing: Partial<ListingRow> = {
  slug: "",
  title: "",
  type: "Land",
  location: "",
  price_kes: 0,
  image: "",
  plot_size: "",
  price: "",
  deposit: "",
  balance_terms: "Balance payable in 12 monthly installments",
  overview: "",
  additional_sections: [],
  status: "available",
  published: true,
};

const statusOptions = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
];

export default function ListingForm({ listingId }: { listingId?: number }) {
  const router = useRouter();
  const isEdit = Boolean(listingId);
  const [form, setForm] = useState<Partial<ListingRow>>(emptyListing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!listingId || !isSupabaseConfigured()) return;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("listings").select("*").eq("id", listingId).single();
      if (data) setForm(data as ListingRow);
    }
    load();
  }, [listingId]);

  const update = <K extends keyof ListingRow>(key: K, value: ListingRow[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const sections = form.additional_sections || [];

  const handleSave = async () => {
    setError("");
    if (!isSupabaseConfigured()) {
      setError("Connect Supabase before saving.");
      return;
    }
    if (!form.title?.trim() || !form.location?.trim()) {
      setError("Title and location are required.");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const payload = {
      slug: slugify(form.slug || form.title || ""),
      title: form.title.trim(),
      type: form.type || "Land",
      location: form.location.trim(),
      price_kes: form.price_kes || parsePriceAmount(form.price) || 0,
      image: form.image || "",
      plot_size: form.plot_size || "",
      price: form.price || "",
      deposit: form.deposit || "",
      balance_terms: form.balance_terms || "",
      overview: form.overview || "",
      additional_sections: sections.filter((section) => section.title.trim() || section.body.trim()),
      status: (form.status || "available") as ListingStatus,
      published: form.published ?? true,
    };

    const query = isEdit
      ? supabase.from("listings").update(payload).eq("id", listingId)
      : supabase.from("listings").insert(payload);
    const { error: saveError } = await query;
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    router.push(adminPath("listings"));
    router.refresh();
  };

  return (
    <AdminShell
      title={isEdit ? "Edit Listing" : "Add Listing"}
      subtitle="Kilifi land listing shown on the public website"
    >
      <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-primary">Listing details</h3>
        <AdminInput
          label="Title"
          value={form.title || ""}
          onChange={(e) => {
            update("title", e.target.value);
            if (!isEdit) update("slug", slugify(e.target.value));
          }}
          required
        />
        <AdminInput
          label="URL slug"
          value={form.slug || ""}
          onChange={(e) => update("slug", slugify(e.target.value))}
          hint="Used in /for-sale/your-slug"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput
            label="Location"
            value={form.location || ""}
            onChange={(e) => update("location", e.target.value)}
            required
          />
          <AdminInput
            label="Type"
            value={form.type || "Land"}
            onChange={(e) => update("type", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminSelect
            label="Status"
            options={statusOptions}
            value={form.status || "available"}
            onChange={(e) => update("status", e.target.value as ListingStatus)}
          />
          <AdminInput
            label="Plot size"
            value={form.plot_size || ""}
            onChange={(e) => update("plot_size", e.target.value)}
            placeholder="50 × 100 ft"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput
            label="Price"
            value={form.price || ""}
            onChange={(e) => {
              update("price", e.target.value);
              const amount = parsePriceAmount(e.target.value);
              if (amount) update("price_kes", amount);
            }}
            placeholder="KES 950,000"
          />
          <AdminInput
            label="Price in KES"
            type="number"
            value={form.price_kes ?? 0}
            onChange={(e) => update("price_kes", Number(e.target.value) || 0)}
            hint="Used by the for-sale price filter"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput
            label="Deposit"
            value={form.deposit || ""}
            onChange={(e) => update("deposit", e.target.value)}
            placeholder="KES 400,000"
          />
          <AdminInput
            label="Balance terms"
            value={form.balance_terms || ""}
            onChange={(e) => update("balance_terms", e.target.value)}
          />
        </div>
        <ImageUpload
          label="Cover image"
          value={form.image || ""}
          onChange={(url) => update("image", url)}
          hint="Upload a photo from this device, or paste an existing image link. PNG, JPG, or WebP up to 10MB."
        />
        <AdminTextarea
          label="Overview"
          value={form.overview || ""}
          onChange={(e) => update("overview", e.target.value)}
          rows={8}
        />

        <div className="space-y-4 rounded-xl border border-accent/30 bg-accent-blend/30 p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-primary">Additional sections</h4>
            <AdminButton
              size="sm"
              variant="outline"
              onClick={() => update("additional_sections", [...sections, { title: "", body: "" }])}
            >
              <Plus size={14} /> Add section
            </AdminButton>
          </div>
          {sections.map((section, index) => (
            <div key={index} className="space-y-3 rounded-xl bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <AdminInput
                    label="Heading"
                    value={section.title}
                    onChange={(e) => {
                      const next = [...sections];
                      next[index] = { ...section, title: e.target.value };
                      update("additional_sections", next);
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="mt-7 rounded-lg p-2 text-primary/40 hover:bg-red-100 hover:text-red-600"
                  onClick={() => update("additional_sections", sections.filter((_, i) => i !== index))}
                  aria-label="Remove section"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <AdminTextarea
                label="Body"
                value={section.body}
                rows={4}
                onChange={(e) => {
                  const next = [...sections];
                  next[index] = { ...section, body: e.target.value };
                  update("additional_sections", next);
                }}
              />
            </div>
          ))}
        </div>

        <AdminToggle
          label="Published"
          checked={form.published ?? true}
          onChange={(value) => update("published", value)}
          description="Published listings appear on the public website once Supabase has at least one listing."
        />

        {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="flex gap-3">
          <AdminButton onClick={handleSave} loading={saving}>
            <Save size={16} /> Save listing
          </AdminButton>
          <AdminButton variant="outline" onClick={() => router.push(adminPath("listings"))}>
            Cancel
          </AdminButton>
        </div>
      </div>
    </AdminShell>
  );
}
