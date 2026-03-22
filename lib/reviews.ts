/**
 * Client-facing review shape (from Google Places API or fallback).
 */
export type ReviewCard = {
  id: string;
  author: string;
  rating: number;
  text: string;
  relativeTime?: string;
  authorPhotoUrl?: string | null;
  authorProfileUrl?: string | null;
};

export type ReviewsPayload = {
  source: "google" | "fallback";
  businessName: string | null;
  rating: number | null;
  totalReviews: number | null;
  reviews: ReviewCard[];
  /** Open in Google Maps / Business Profile reviews */
  googleMapsUrl: string | null;
};

/** Shown when API keys are not set or the request fails */
export const FALLBACK_REVIEWS: ReviewsPayload = {
  source: "fallback",
  businessName: "Martha Properties",
  rating: 5,
  totalReviews: null,
  googleMapsUrl: null,
  reviews: [
    {
      id: "fb-1",
      author: "Client — Kilifi",
      rating: 5,
      relativeTime: "Representative feedback",
      text: "Clear communication from the first call through to site visit. We felt guided on payment options and documentation without pressure.",
    },
    {
      id: "fb-2",
      author: "Buyer — coastal investment",
      rating: 5,
      relativeTime: "Representative feedback",
      text: "Professional, patient, and knowledgeable about the local market. The process felt transparent and well explained.",
    },
    {
      id: "fb-3",
      author: "Family relocating",
      rating: 5,
      relativeTime: "Representative feedback",
      text: "Martha took time to understand what we needed and matched us with options that actually fit our budget and timeline.",
    },
  ],
};
