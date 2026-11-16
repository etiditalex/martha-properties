"use client";

import { useEffect, useState } from "react";
import { Download, Plus, Star, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { AdminInput, AdminTextarea, AdminToggle } from "@/components/admin/AdminForm";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { ReviewRow } from "@/lib/supabase/types";
import { FALLBACK_REVIEWS } from "@/lib/reviews";

const emptyReview = {
  author: "",
  rating: 5,
  text: "",
  relative_time: "",
  published: true,
  sort_order: 0,
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [form, setForm] = useState(emptyReview);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const { data } = await supabase.from("reviews").select("*").order("sort_order", { ascending: true });
    setReviews((data as ReviewRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setMessage("");
    if (!isSupabaseConfigured()) {
      setMessage("Connect Supabase before saving.");
      return;
    }
    if (!form.author.trim() || !form.text.trim()) {
      setMessage("Author and review text are required.");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("reviews").insert({
      author: form.author.trim(),
      rating: form.rating,
      text: form.text.trim(),
      relative_time: form.relative_time.trim() || null,
      published: form.published,
      sort_order: reviews.length,
    });
    setSaving(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setForm(emptyReview);
    setMessage("Review saved.");
    load();
  };

  const handleImport = async () => {
    if (!isSupabaseConfigured()) {
      setMessage("Connect Supabase before importing.");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("reviews").insert(
      FALLBACK_REVIEWS.reviews.map((review, index) => ({
        author: review.author,
        rating: review.rating,
        text: review.text,
        relative_time: review.relativeTime || null,
        published: true,
        sort_order: index,
      }))
    );
    setSaving(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Imported the current website reviews.");
    load();
  };

  const togglePublished = async (review: ReviewRow) => {
    const supabase = createClient();
    await supabase.from("reviews").update({ published: !review.published }).eq("id", review.id);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const supabase = createClient();
    await supabase.from("reviews").delete().eq("id", id);
    load();
  };

  return (
    <AdminShell title="Reviews" subtitle="Client reviews shown when live Google reviews are not connected">
      <div className="mb-6 flex flex-wrap justify-end">
        <AdminButton variant="secondary" onClick={handleImport} loading={saving}>
          <Download size={16} /> Import from website
        </AdminButton>
      </div>

      {message && <div className="mb-6 rounded-xl bg-accent-blend px-4 py-3 text-sm text-primary">{message}</div>}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-3">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent/40 border-t-accent" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-primary/20 bg-white py-16 text-center text-sm text-primary/50">
              No reviews in the database yet
            </div>
          ) : (
            reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">{review.author}</p>
                    <div className="mt-1 flex items-center gap-0.5 text-accent">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star key={index} size={14} className={index < review.rating ? "fill-accent" : "opacity-30"} />
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(review.id)}
                    className="rounded-lg p-1.5 text-primary/40 hover:bg-red-100 hover:text-red-600"
                    aria-label="Delete review"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="mt-3 text-sm text-primary/75">{review.text}</p>
                <div className="mt-4">
                  <AdminToggle
                    label={review.published ? "Published" : "Hidden"}
                    checked={review.published}
                    onChange={() => togglePublished(review)}
                  />
                </div>
              </article>
            ))
          )}
        </div>

        <form
          className="h-fit space-y-4 rounded-2xl border border-primary/10 bg-white p-6 shadow-sm lg:col-span-2"
          onSubmit={(event) => {
            event.preventDefault();
            handleSave();
          }}
        >
          <h3 className="text-lg font-bold text-primary">Add a review</h3>
          <AdminInput label="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <AdminInput
            label="Rating"
            type="number"
            min={1}
            max={5}
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) || 5 })}
          />
          <AdminInput
            label="Time label"
            value={form.relative_time}
            onChange={(e) => setForm({ ...form, relative_time: e.target.value })}
            placeholder="Representative feedback"
          />
          <AdminTextarea
            label="Review"
            rows={5}
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
          />
          <AdminButton type="submit" loading={saving}>
            <Plus size={16} /> Save review
          </AdminButton>
        </form>
      </div>
    </AdminShell>
  );
}
