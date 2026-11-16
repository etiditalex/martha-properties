"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { AdminInput } from "@/components/admin/AdminForm";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { CONTACT_SETTINGS_KEY, DEFAULT_CONTACT, type SiteContact } from "@/lib/site";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteContact>(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", CONTACT_SETTINGS_KEY)
        .maybeSingle();
      if (data?.value && typeof data.value === "object") {
        setForm({ ...DEFAULT_CONTACT, ...(data.value as Partial<SiteContact>) });
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setMessage("");
    setError("");
    if (!isSupabaseConfigured()) {
      setError("Connect Supabase before saving settings.");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const value: SiteContact = {
      ...form,
      phoneHref: form.phone.replace(/[^\d+]/g, "").startsWith("+")
        ? `tel:${form.phone.replace(/[^\d+]/g, "")}`
        : `tel:+${form.phone.replace(/[^\d]/g, "")}`,
    };
    const { error: saveError } = await supabase
      .from("site_settings")
      .upsert({ key: CONTACT_SETTINGS_KEY, value }, { onConflict: "key" });
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setForm(value);
    setMessage("Contact details saved. The public contact page will use them.");
  };

  return (
    <AdminShell title="Settings" subtitle="Public contact details for Martha Properties">
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent/40 border-t-accent" />
        </div>
      ) : (
        <div className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
          <AdminInput
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <AdminInput
            label="Website"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
          <AdminInput
            label="Website label"
            value={form.websiteLabel}
            onChange={(e) => setForm({ ...form, websiteLabel: e.target.value })}
          />
          <AdminInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            hint="Optional. Stored with your contact settings."
          />
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {message && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
          <AdminButton onClick={handleSave} loading={saving}>
            <Save size={16} /> Save settings
          </AdminButton>
        </div>
      )}
    </AdminShell>
  );
}
