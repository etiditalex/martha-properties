"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, MapPin, Search } from "lucide-react";
import { type LandListing } from "@/lib/listings";
import { useLiveBlogs } from "@/lib/useLiveBlogs";
import { useLiveListings } from "@/lib/useLiveListings";

type SearchFilters = {
  location: string;
  propertyType: string;
  plotSize: string;
  minPrice: string;
  maxPrice: string;
  status: string;
};

const defaultFilters: SearchFilters = {
  location: "all",
  propertyType: "all",
  plotSize: "all",
  minPrice: "",
  maxPrice: "",
  status: "all",
};

/* text-base on small screens avoids iOS zoom on focus; min-h 44px = touch target */
const fieldClass =
  "w-full min-h-[44px] appearance-none rounded-md border border-martha-charcoal/12 bg-white py-3 pl-3 pr-9 text-base md:text-sm text-martha-charcoal shadow-sm placeholder:text-martha-charcoal/45 focus:outline-none focus:ring-2 focus:ring-martha-warm/35 focus:border-martha-warm/40 touch-manipulation";

const selectWrapClass = "relative min-w-0 flex-1 xl:min-w-[7.5rem]";

function SelectChevron() {
  return (
    <ChevronDown
      className="pointer-events-none absolute right-2.5 top-1/2 size-[18px] -translate-y-1/2 text-martha-charcoal/45"
      aria-hidden
    />
  );
}

function parseOptionalKes(value: string): number | undefined {
  const n = Number(String(value).replace(/,/g, "").trim());
  if (!Number.isFinite(n) || n < 0) return undefined;
  return n;
}

function filterListings(
  listings: LandListing[],
  applied: SearchFilters
): LandListing[] {
  const minKes = parseOptionalKes(applied.minPrice);
  const maxKes = parseOptionalKes(applied.maxPrice);

  return listings.filter((l) => {
    const loc = applied.location;
    if (loc !== "all" && loc !== "kenya" && l.location !== loc) {
      return false;
    }
    if (
      applied.propertyType !== "all" &&
      l.type !== applied.propertyType
    ) {
      return false;
    }
    if (applied.plotSize !== "all" && l.plotSize !== applied.plotSize) {
      return false;
    }
    if (minKes !== undefined && l.priceKes < minKes) return false;
    if (maxKes !== undefined && l.priceKes > maxKes) return false;
    return true;
  });
}

export default function ForSalePage() {
  const listings = useLiveListings();
  const { recent: recentPosts } = useLiveBlogs();
  const locationOptions = useMemo(
    () => Array.from(new Set(listings.map((l) => l.location))).sort(),
    [listings]
  );
  const plotSizeOptions = useMemo(
    () => Array.from(new Set(listings.map((l) => l.plotSize))).sort(),
    [listings]
  );
  const propertyTypes = useMemo(
    () => Array.from(new Set(listings.map((l) => l.type))).sort(),
    [listings]
  );

  const [draft, setDraft] = useState<SearchFilters>(defaultFilters);
  const [applied, setApplied] = useState<SearchFilters>(defaultFilters);

  const filtered = useMemo(
    () => filterListings(listings, applied),
    [listings, applied]
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setApplied({ ...draft });
  }

  return (
    <>
      <section className="relative min-h-[42vh] md:min-h-[48vh] overflow-hidden">
        <h1 className="sr-only">Properties for sale</h1>
        <Image
          src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1774174960/WhatsApp_Image_2026-03-09_at_11.25.26_tyfvlp.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-martha-black/50" aria-hidden />
      </section>

      <div
        id="property-search"
        className="scroll-mt-28 border-b border-martha-charcoal/10 bg-martha-sand"
      >
        <div className="w-full min-w-0 px-4 py-5 sm:px-6 md:px-8 md:py-6 lg:px-10 xl:px-12 2xl:px-16 [padding-left:max(1rem,env(safe-area-inset-left))] [padding-right:max(1rem,env(safe-area-inset-right))]">
          <motion.form
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            onSubmit={handleSearch}
            className="flex flex-col gap-3 xl:flex-row xl:items-stretch xl:gap-3"
            aria-label="Search properties"
          >
            <div className={selectWrapClass}>
              <label htmlFor="fs-location" className="sr-only">
                Location
              </label>
              <select
                id="fs-location"
                className={fieldClass}
                value={draft.location}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, location: e.target.value }))
                }
              >
                <option value="all">All areas</option>
                <option value="kenya">Kenya</option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>

            <div className={selectWrapClass}>
              <label htmlFor="fs-type" className="sr-only">
                Property type
              </label>
              <select
                id="fs-type"
                className={fieldClass}
                value={draft.propertyType}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, propertyType: e.target.value }))
                }
              >
                <option value="all">All types</option>
                {propertyTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>

            <div className={selectWrapClass}>
              <label htmlFor="fs-plot" className="sr-only">
                Plot size
              </label>
              <select
                id="fs-plot"
                className={fieldClass}
                value={draft.plotSize}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, plotSize: e.target.value }))
                }
              >
                <option value="all">Any plot size</option>
                {plotSizeOptions.map((ps) => (
                  <option key={ps} value={ps}>
                    {ps}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>

            <div className="relative min-w-0 flex-1 xl:min-w-[7rem]">
              <label htmlFor="fs-min" className="sr-only">
                Minimum price (KES)
              </label>
              <input
                id="fs-min"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Min price (KES)"
                className={`${fieldClass} pr-3`}
                value={draft.minPrice}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, minPrice: e.target.value }))
                }
              />
            </div>

            <div className="relative min-w-0 flex-1 xl:min-w-[7rem]">
              <label htmlFor="fs-max" className="sr-only">
                Maximum price (KES)
              </label>
              <input
                id="fs-max"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Max price (KES)"
                className={`${fieldClass} pr-3`}
                value={draft.maxPrice}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, maxPrice: e.target.value }))
                }
              />
            </div>

            <div className={selectWrapClass}>
              <label htmlFor="fs-status" className="sr-only">
                Status
              </label>
              <select
                id="fs-status"
                className={fieldClass}
                value={draft.status}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, status: e.target.value }))
                }
              >
                <option value="all">Any status</option>
                <option value="available">Available now</option>
              </select>
              <SelectChevron />
            </div>

            <button
              type="submit"
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-md bg-martha-warm px-5 min-h-[44px] py-3 text-sm font-semibold text-martha-black shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-martha-warm focus-visible:ring-offset-2 focus-visible:ring-offset-martha-sand touch-manipulation xl:w-auto xl:self-stretch"
            >
              Search
              <Search className="size-[18px]" strokeWidth={2.25} aria-hidden />
            </button>
          </motion.form>
        </div>
      </div>

      <div className="w-full min-w-0 bg-martha-cream py-14 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 [padding-left:max(1rem,env(safe-area-inset-left))] [padding-right:max(1rem,env(safe-area-inset-right))]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-10 xl:gap-12 min-w-0">
            {/* Main listings — same card layout as homepage featured plots */}
            <div className="min-w-0 flex-1">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filtered.map((listing, i) => (
                  <motion.article
                    key={listing.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex h-full flex-col overflow-hidden rounded-lg border border-martha-sand bg-white transition-colors hover:border-martha-warm/40"
                  >
                    <Link
                      href={`/for-sale/${listing.slug}`}
                      className="group relative block aspect-[4/3] bg-martha-sand focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-martha-warm"
                    >
                      <Image
                        src={listing.image}
                        alt={listing.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-2 text-sm text-martha-warm">
                        <span>{listing.type}</span>
                        <span className="text-martha-charcoal/50">•</span>
                        <span className="flex items-center gap-1 text-martha-charcoal/80">
                          <MapPin size={12} /> {listing.location}
                        </span>
                      </div>
                      <Link
                        href={`/for-sale/${listing.slug}`}
                        className="group mt-2 block rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-martha-warm focus-visible:ring-offset-2"
                      >
                        <h2 className="text-lg font-semibold text-martha-black transition-colors group-hover:text-martha-warm break-words">
                          {listing.title}
                        </h2>
                      </Link>
                      <p className="mt-1 text-sm text-martha-charcoal/80">
                        Plot {listing.plotSize}
                      </p>
                      <p className="mt-3 text-lg font-semibold text-martha-black">
                        {listing.price}
                      </p>
                      <p className="mt-1 text-sm text-martha-charcoal/85">
                        Deposit {listing.deposit}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-martha-charcoal/80">
                        {listing.balanceTerms}
                      </p>
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                          href={`/for-sale/${listing.slug}`}
                          className="text-sm font-medium text-martha-warm hover:underline py-2 min-h-[44px] sm:min-h-0 sm:py-0 inline-flex items-center touch-manipulation"
                        >
                          View full details →
                        </Link>
                        <Link
                          href={`/contact?property=${encodeURIComponent(listing.slug)}`}
                          className="text-sm font-medium text-martha-charcoal/80 hover:text-martha-warm py-2 min-h-[44px] sm:min-h-0 sm:py-0 inline-flex items-center touch-manipulation"
                        >
                          Enquire
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="py-6">
                  <h2 className="sr-only">Property listings</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
                    {listings.map((listing, i) => (
                        <Link
                          key={listing.id}
                          href={`/for-sale/${listing.slug}`}
                          className="group block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-martha-warm focus-visible:ring-offset-2"
                        >
                          <motion.article
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex h-full flex-col overflow-hidden rounded-lg border border-martha-sand bg-white transition-colors hover:border-martha-warm/40"
                          >
                            <div className="relative aspect-[4/3] bg-martha-sand">
                              <Image
                                src={listing.image}
                                alt={listing.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                              />
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                              <div className="flex items-center gap-2 text-sm text-martha-warm">
                                <span>{listing.type}</span>
                                <span className="text-martha-charcoal/50">•</span>
                                <span className="flex items-center gap-1 text-martha-charcoal/80">
                                  <MapPin size={12} /> {listing.location}
                                </span>
                              </div>
                              <h3 className="mt-2 font-semibold text-martha-black transition-colors group-hover:text-martha-warm">
                                {listing.title}
                              </h3>
                              <p className="mt-1 text-sm text-martha-charcoal/80">
                                Plot {listing.plotSize}
                              </p>
                              <p className="mt-3 text-lg font-semibold text-martha-black">
                                {listing.price}
                              </p>
                              <p className="mt-1 text-sm text-martha-charcoal/85">
                                Deposit {listing.deposit}
                              </p>
                              <p className="mt-1 text-sm leading-snug text-martha-charcoal/80">
                                {listing.balanceTerms}
                              </p>
                              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-martha-warm">
                                View details <ArrowRight size={14} />
                              </span>
                            </div>
                          </motion.article>
                        </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-14 rounded-lg bg-martha-sand p-6 text-center md:p-8">
                <p className="text-martha-charcoal/90">
                  Don’t see what you’re looking for? We have more properties and
                  off-market opportunities.
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center justify-center min-h-[44px] rounded-lg bg-martha-black px-5 py-2.5 font-medium text-martha-cream transition-colors hover:bg-martha-charcoal touch-manipulation w-full max-w-xs mx-auto sm:mx-0 sm:w-auto sm:max-w-none"
                >
                  Tell us your requirements
                </Link>
              </div>
            </div>

            {/* Sidebar: new blogs + all properties (quick links + search) */}
            <aside className="w-full shrink-0 space-y-8 lg:sticky lg:top-24 lg:w-72 xl:w-80 2xl:w-96 lg:self-start">
              <div className="rounded-lg border border-martha-sand bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-martha-sand pb-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-martha-black">
                    New blogs
                  </h2>
                  <Link
                    href="/blogs"
                    className="inline-flex size-10 items-center justify-center rounded-md text-martha-warm transition-colors hover:bg-martha-sand"
                    aria-label="Browse and search blog posts"
                  >
                    <Search className="size-5" strokeWidth={2.25} />
                  </Link>
                </div>
                <ul className="space-y-4">
                  {recentPosts.slice(0, 3).map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blogs/${post.slug}`}
                        className="group block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-martha-warm/50"
                      >
                        <p className="text-xs text-martha-charcoal/60">
                          {post.date}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-martha-black group-hover:text-martha-warm">
                          {post.title}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/blogs"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-martha-warm hover:underline"
                >
                  <Search className="size-3.5" aria-hidden />
                  View all posts
                </Link>
              </div>

              <div className="rounded-lg border border-martha-sand bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-martha-sand pb-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-martha-black">
                    Properties
                  </h2>
                  <Link
                    href="#property-search"
                    className="inline-flex size-10 items-center justify-center rounded-md text-martha-warm transition-colors hover:bg-martha-sand"
                    aria-label="Jump to property search filters"
                  >
                    <Search className="size-5" strokeWidth={2.25} />
                  </Link>
                </div>
                <ul className="space-y-3">
                  {listings.map((listing) => (
                    <li key={listing.id}>
                      <Link
                        href={`/for-sale/${listing.slug}`}
                        className="group flex gap-3 rounded-md p-1.5 -m-1.5 transition-colors hover:bg-martha-cream"
                      >
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-martha-sand">
                          <Image
                            src={listing.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-martha-black group-hover:text-martha-warm line-clamp-2">
                            {listing.title}
                          </p>
                          <p className="mt-0.5 text-xs text-martha-charcoal/70 line-clamp-1">
                            {listing.location}
                          </p>
                          <p className="mt-0.5 text-xs font-semibold text-martha-warm">
                            {listing.price}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#property-search"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-martha-warm hover:underline"
                >
                  <Search className="size-3.5" aria-hidden />
                  Refine search
                </Link>
              </div>
            </aside>
        </div>
      </div>
    </>
  );
}
