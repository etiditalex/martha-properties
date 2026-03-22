"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Loader2, Star } from "lucide-react";
import type { ReviewsPayload } from "@/lib/reviews";

function StarRow({ rating }: { rating: number }) {
  const r = Math.round(Math.min(5, Math.max(0, rating)));
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${r} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={18}
          className={
            i < r
              ? "fill-martha-warm text-martha-warm"
              : "fill-martha-sand/80 text-martha-sand"
          }
          aria-hidden
        />
      ))}
    </div>
  );
}

export function GoogleReviewsSection() {
  const [data, setData] = useState<ReviewsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/reviews");
        const json = (await res.json()) as ReviewsPayload;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const payload = data;

  return (
    <section
      className="section-padding bg-martha-cream border-t border-martha-sand/80"
      aria-labelledby="reviews-heading"
    >
      <div className="max-w-6xl mx-auto w-full min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-martha-warm">
            <span className="h-px w-10 bg-martha-warm/50" aria-hidden />
            Google reviews
            <span className="h-px w-10 bg-martha-warm/50" aria-hidden />
          </span>
          <h2
            id="reviews-heading"
            className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-martha-black break-words"
          >
            What clients say
          </h2>

          {loading && (
            <div className="mt-6 flex justify-center text-martha-warm">
              <Loader2 className="size-8 animate-spin" aria-hidden />
              <span className="sr-only">Loading reviews</span>
            </div>
          )}

          {!loading && payload && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              {payload.rating != null && (
                <div className="flex flex-col items-center">
                  <span className="text-4xl sm:text-5xl font-bold text-martha-black tabular-nums">
                    {payload.rating.toFixed(1)}
                  </span>
                  <StarRow rating={Math.round(payload.rating)} />
                  {payload.totalReviews != null && (
                    <span className="mt-1 text-sm text-martha-charcoal/70">
                      Based on {payload.totalReviews.toLocaleString()} Google
                      reviews
                    </span>
                  )}
                </div>
              )}
              {payload.googleMapsUrl && (
                <a
                  href={payload.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border-2 border-martha-sand bg-white px-5 py-2.5 text-sm font-semibold text-martha-black shadow-sm hover:border-martha-warm/40 hover:text-martha-warm transition-colors touch-manipulation"
                >
                  View on Google Maps
                  <ExternalLink size={16} aria-hidden />
                </a>
              )}
            </div>
          )}
        </motion.div>

        {!loading && payload && payload.reviews.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 list-none p-0 m-0">
            {payload.reviews.map((review, i) => (
              <motion.li
                key={review.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-martha-sand bg-white p-6 shadow-sm flex flex-col min-h-[200px]"
              >
                <div className="flex items-start gap-3">
                  {review.authorPhotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.authorPhotoUrl}
                      alt=""
                      width={44}
                      height={44}
                      className="size-11 rounded-full object-cover bg-martha-sand shrink-0"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className="size-11 rounded-full bg-martha-warm/20 text-martha-warm flex items-center justify-center text-sm font-bold shrink-0"
                      aria-hidden
                    >
                      {review.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 gap-y-1">
                      {review.authorProfileUrl ? (
                        <a
                          href={review.authorProfileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-martha-black hover:text-martha-warm truncate max-w-full"
                        >
                          {review.author}
                        </a>
                      ) : (
                        <span className="font-semibold text-martha-black truncate">
                          {review.author}
                        </span>
                      )}
                    </div>
                    {review.relativeTime && (
                      <p className="text-xs text-martha-charcoal/60 mt-0.5">
                        {review.relativeTime}
                      </p>
                    )}
                    <div className="mt-2">
                      <StarRow rating={review.rating} />
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-martha-charcoal/90 leading-relaxed grow line-clamp-6 sm:line-clamp-none">
                  {review.text}
                </p>
              </motion.li>
            ))}
          </ul>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-martha-charcoal/75 mb-4">
            Worked with us? We&apos;d love your feedback on Google.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            {payload?.googleMapsUrl && (
              <a
                href={payload.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-martha-warm px-5 py-3 text-sm font-semibold text-martha-black hover:opacity-90 touch-manipulation"
              >
                Leave a Google review
                <ExternalLink size={16} aria-hidden />
              </a>
            )}
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-martha-charcoal/20 px-5 py-3 text-sm font-semibold text-martha-black hover:border-martha-warm hover:text-martha-warm touch-manipulation"
            >
              Contact us directly
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
