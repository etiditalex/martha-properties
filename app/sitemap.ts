import type { MetadataRoute } from "next";
import { getPublishedBlogs, getPublishedListings } from "@/lib/data/queries";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

function modified(value?: string) {
  if (!value) return new Date();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ listings }, { posts }] = await Promise.all([
    getPublishedListings(),
    getPublishedBlogs(),
  ]);

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/for-sale"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/blogs"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/contact"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/booking"), changeFrequency: "monthly", priority: 0.6 },
  ];

  return [
    ...pages,
    ...listings.map((listing) => ({
      url: absoluteUrl(`/for-sale/${listing.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blogs/${post.slug}`),
      lastModified: modified(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
