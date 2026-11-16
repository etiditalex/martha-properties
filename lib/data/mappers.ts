import type { BlogPost } from "@/lib/blog-posts";
import type { LandListing } from "@/lib/listings";
import type { ReviewCard } from "@/lib/reviews";
import type { BlogRow, ListingRow, ReviewRow } from "@/lib/supabase/types";

export function mapListing(row: ListingRow): LandListing {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.type || "Land",
    location: row.location,
    priceKes: Number(row.price_kes) || 0,
    image: (Array.isArray(row.gallery) && row.gallery[0]) || row.image || "",
    images: Array.isArray(row.gallery) && row.gallery.length ? row.gallery : row.image ? [row.image] : [],
    plotSize: row.plot_size || "",
    price: row.price || "",
    deposit: row.deposit || "",
    balanceTerms: row.balance_terms || "",
    overview: row.overview || "",
    additionalSections: Array.isArray(row.additional_sections) ? row.additional_sections : [],
    status: row.status || "available",
  };
}

export function listingToRow(listing: LandListing): Omit<ListingRow, "id" | "created_at" | "updated_at"> {
  return {
    slug: listing.slug,
    title: listing.title,
    type: listing.type,
    location: listing.location,
    price_kes: listing.priceKes,
    image: listing.images?.[0] || listing.image,
    gallery: (listing.images?.length ? listing.images : listing.image ? [listing.image] : []).slice(0, 10),
    plot_size: listing.plotSize,
    price: listing.price,
    deposit: listing.deposit,
    balance_terms: listing.balanceTerms,
    overview: listing.overview,
    additional_sections: listing.additionalSections,
    status: listing.status || "available",
    published: true,
  };
}

export function mapBlog(row: BlogRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    date: row.published_at,
    excerpt: row.excerpt,
    body: row.body,
  };
}

export function mapReview(row: ReviewRow): ReviewCard {
  return {
    id: row.id,
    author: row.author,
    rating: row.rating,
    text: row.text,
    relativeTime: row.relative_time || undefined,
  };
}
