import { NextResponse } from "next/server";
import {
  FALLBACK_REVIEWS,
  type ReviewCard,
  type ReviewsPayload,
} from "@/lib/reviews";

export const revalidate = 3600;

type GooglePlaceReview = {
  rating?: number;
  text?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
};

type GooglePlaceResponse = {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  reviews?: GooglePlaceReview[];
};

function buildPayloadFromGoogle(
  data: GooglePlaceResponse,
  googleMapsUrl: string | null
): ReviewsPayload {
    const reviews: ReviewCard[] = (data.reviews ?? [])
      .slice(0, 5)
      .map((r, i) => ({
        id: `g-${i}-${r.authorAttribution?.displayName ?? "r"}`,
        author: r.authorAttribution?.displayName ?? "Google user",
        rating: Math.min(5, Math.max(1, Math.round(r.rating ?? 0))),
        text: (r.text?.text ?? "").trim() || "(No comment)",
        relativeTime: r.relativePublishTimeDescription,
        authorPhotoUrl: r.authorAttribution?.photoUri ?? null,
        authorProfileUrl: r.authorAttribution?.uri ?? null,
      }));

  return {
    source: "google",
    businessName: data.displayName?.text ?? FALLBACK_REVIEWS.businessName,
    rating: typeof data.rating === "number" ? data.rating : null,
    totalReviews:
      typeof data.userRatingCount === "number" ? data.userRatingCount : null,
    reviews: reviews.length > 0 ? reviews : FALLBACK_REVIEWS.reviews,
    googleMapsUrl,
  };
}

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();
  const publicMapsUrl =
    process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL?.trim() || null;

  const fallbackPayload: ReviewsPayload = {
    ...FALLBACK_REVIEWS,
    googleMapsUrl: publicMapsUrl ?? FALLBACK_REVIEWS.googleMapsUrl,
  };

  if (!apiKey || !placeId) {
    return NextResponse.json(fallbackPayload);
  }

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "displayName,rating,userRatingCount,reviews.rating,reviews.text,reviews.relativePublishTimeDescription,reviews.authorAttribution",
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[reviews] Places API error", res.status, body);
      return NextResponse.json(fallbackPayload);
    }

    const data = (await res.json()) as GooglePlaceResponse;
    const payload = buildPayloadFromGoogle(data, publicMapsUrl);

    if (payload.reviews.length === 0) {
      return NextResponse.json(fallbackPayload);
    }

    return NextResponse.json(payload);
  } catch (e) {
    console.error("[reviews] fetch failed", e);
    return NextResponse.json(fallbackPayload);
  }
}
