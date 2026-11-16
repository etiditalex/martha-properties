"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Pencil, Plus, Search, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { BlogRow } from "@/lib/supabase/types";
import { adminPath } from "@/lib/admin/path";
import { formatAdminDate } from "@/lib/admin/utils";
import { BLOG_POSTS } from "@/lib/blog-posts";

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const { data } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
    setPosts((data as BlogRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    const supabase = createClient();
    await supabase.from("blog_posts").delete().eq("id", id);
    load();
  };

  const handleImport = async () => {
    if (!isSupabaseConfigured()) {
      setMessage("Connect Supabase before importing.");
      return;
    }
    setImporting(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.from("blog_posts").upsert(
      BLOG_POSTS.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: post.body || "",
        published_at: post.date,
        published: true,
      })),
      { onConflict: "slug" }
    );
    setImporting(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage(`Imported ${BLOG_POSTS.length} posts.`);
    await load();
  };

  const filtered = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell title="Blogs" subtitle="Articles on the Martha Properties blog">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" />
          <input
            type="search"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-primary/20 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-blend"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="secondary" onClick={handleImport} loading={importing}>
            <Download size={16} /> Import from website
          </AdminButton>
          <Link href={adminPath("blogs/new")}>
            <AdminButton>
              <Plus size={16} /> Add Post
            </AdminButton>
          </Link>
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>
      )}

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent/40 border-t-accent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-primary/20 bg-white py-16 text-center">
          <p className="text-primary/60">No posts found</p>
          <div className="mt-4 flex justify-center gap-3">
            <AdminButton size="sm" variant="secondary" onClick={handleImport} loading={importing}>
              Import from website
            </AdminButton>
            <Link href={adminPath("blogs/new")}>
              <AdminButton size="sm">Add your first post</AdminButton>
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-primary/10 bg-primary/5">
              <tr>
                <th className="px-4 py-3 font-semibold text-primary/70">Post</th>
                <th className="hidden px-4 py-3 font-semibold text-primary/70 md:table-cell">Date</th>
                <th className="px-4 py-3 font-semibold text-primary/70">Status</th>
                <th className="px-4 py-3 font-semibold text-primary/70">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {filtered.map((post) => (
                <tr key={post.id} className="transition hover:bg-accent-blend/30">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-primary">{post.title}</p>
                    <p className="text-xs text-primary/40">{post.slug}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-primary/70 md:table-cell">
                    {formatAdminDate(post.published_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-accent-blend px-2.5 py-0.5 text-xs font-bold uppercase text-primary">
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={adminPath(`blogs/${post.id}`)}
                        className="rounded-lg p-1.5 text-primary/40 hover:bg-accent-blend hover:text-primary"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
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
