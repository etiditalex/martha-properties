"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { AdminInput, AdminTextarea, AdminToggle } from "@/components/admin/AdminForm";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { BlogRow } from "@/lib/supabase/types";
import { adminPath } from "@/lib/admin/path";
import { slugify } from "@/lib/admin/utils";

const emptyPost: Partial<BlogRow> = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  published_at: new Date().toISOString().slice(0, 10),
  published: true,
};

export default function BlogForm({ postId }: { postId?: number }) {
  const router = useRouter();
  const isEdit = Boolean(postId);
  const [form, setForm] = useState<Partial<BlogRow>>(emptyPost);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!postId || !isSupabaseConfigured()) return;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("blog_posts").select("*").eq("id", postId).single();
      if (data) setForm(data as BlogRow);
    }
    load();
  }, [postId]);

  const update = <K extends keyof BlogRow>(key: K, value: BlogRow[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    setError("");
    if (!isSupabaseConfigured()) {
      setError("Connect Supabase before saving.");
      return;
    }
    if (!form.title?.trim() || !form.excerpt?.trim()) {
      setError("Title and excerpt are required.");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const payload = {
      slug: slugify(form.slug || form.title || ""),
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      body: form.body || "",
      published_at: form.published_at || new Date().toISOString().slice(0, 10),
      published: form.published ?? true,
    };
    const query = isEdit
      ? supabase.from("blog_posts").update(payload).eq("id", postId)
      : supabase.from("blog_posts").insert(payload);
    const { error: saveError } = await query;
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    router.push(adminPath("blogs"));
    router.refresh();
  };

  return (
    <AdminShell title={isEdit ? "Edit Blog" : "Add Blog"} subtitle="Stories published on the Martha Properties blog">
      <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
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
          hint="Used in /blogs/your-slug"
        />
        <AdminInput
          label="Date"
          type="date"
          value={(form.published_at || "").slice(0, 10)}
          onChange={(e) => update("published_at", e.target.value)}
        />
        <AdminTextarea
          label="Excerpt"
          value={form.excerpt || ""}
          onChange={(e) => update("excerpt", e.target.value)}
          rows={3}
        />
        <AdminTextarea
          label="Article"
          value={form.body || ""}
          onChange={(e) => update("body", e.target.value)}
          rows={10}
        />
        <AdminToggle
          label="Published"
          checked={form.published ?? true}
          onChange={(value) => update("published", value)}
        />
        {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <div className="flex gap-3">
          <AdminButton onClick={handleSave} loading={saving}>
            <Save size={16} /> Save post
          </AdminButton>
          <AdminButton variant="outline" onClick={() => router.push(adminPath("blogs"))}>
            Cancel
          </AdminButton>
        </div>
      </div>
    </AdminShell>
  );
}
