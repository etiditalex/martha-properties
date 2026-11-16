import { BLOG_POSTS, getBlogPostBySlug, type BlogPost } from "@/lib/blog-posts";
import { getLandListingBySlug, LAND_LISTINGS, type LandListing } from "@/lib/listings";
import { FALLBACK_REVIEWS, type ReviewCard } from "@/lib/reviews";
import { mapBlog, mapListing, mapReview } from "@/lib/data/mappers";
import { createAnonClient } from "@/lib/supabase/server";
import { DEFAULT_CONTACT, type SiteContact, CONTACT_SETTINGS_KEY } from "@/lib/site";
import type { BlogRow, ListingRow, ReviewRow } from "@/lib/supabase/types";

export async function getPublishedListings(): Promise<{
  source: "database" | "catalog";
  listings: LandListing[];
}> {
  const supabase = createAnonClient();
  if (!supabase) return { source: "catalog", listings: LAND_LISTINGS };

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("published", true)
    .order("id", { ascending: true });

  if (error || !data?.length) return { source: "catalog", listings: LAND_LISTINGS };
  return { source: "database", listings: (data as ListingRow[]).map(mapListing) };
}

export async function getPublishedListingBySlug(slug: string): Promise<LandListing | undefined> {
  const supabase = createAnonClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (!error && data) return mapListing(data as ListingRow);
  }
  return getLandListingBySlug(slug);
}

export async function getPublishedBlogs(): Promise<{
  source: "database" | "catalog";
  posts: BlogPost[];
}> {
  const supabase = createAnonClient();
  if (!supabase) return { source: "catalog", posts: BLOG_POSTS };

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data?.length) return { source: "catalog", posts: BLOG_POSTS };
  return { source: "database", posts: (data as BlogRow[]).map(mapBlog) };
}

export async function getPublishedBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  const supabase = createAnonClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (!error && data) return mapBlog(data as BlogRow);
  }
  return getBlogPostBySlug(slug);
}

export async function getPublishedReviews(): Promise<ReviewCard[] | null> {
  const supabase = createAnonClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return null;
  return (data as ReviewRow[]).map(mapReview);
}

export function catalogReviews(): ReviewCard[] {
  return FALLBACK_REVIEWS.reviews;
}

export async function getSiteContact(): Promise<SiteContact> {
  const supabase = createAnonClient();
  if (!supabase) return DEFAULT_CONTACT;

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", CONTACT_SETTINGS_KEY)
    .maybeSingle();

  if (error || !data?.value || typeof data.value !== "object") return DEFAULT_CONTACT;
  return { ...DEFAULT_CONTACT, ...(data.value as Partial<SiteContact>) };
}
