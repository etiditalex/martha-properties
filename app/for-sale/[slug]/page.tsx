import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import {
  getLandListingBySlug,
  LAND_LISTINGS,
} from "@/lib/listings";

export function generateStaticParams() {
  return LAND_LISTINGS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = getLandListingBySlug(slug);
  if (!listing) return { title: "Property | Martha Properties" };
  return {
    title: `${listing.title} | Martha Properties`,
    description: `${listing.plotSize} land in ${listing.location}. ${listing.price}. ${listing.balanceTerms}.`,
  };
}

export default async function LandListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = getLandListingBySlug(slug);
  if (!listing) notFound();

  return (
    <div className="section-padding">
      <div className="max-w-6xl mx-auto w-full min-w-0">
        <Link
          href="/for-sale"
          className="inline-flex items-center gap-1 text-martha-charcoal/80 hover:text-martha-warm text-sm font-medium mb-8"
        >
          ← Back to properties for sale
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 min-w-0">
          <div className="lg:col-span-3 space-y-8 min-w-0">
            <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-martha-sand">
              <Image
                src={listing.image}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-martha-warm">
                <span>{listing.type}</span>
                <span className="text-martha-charcoal/40">•</span>
                <span className="text-martha-charcoal/80 flex items-center gap-1">
                  <MapPin size={14} /> {listing.location}
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-martha-black break-words">
                {listing.title}
              </h1>
              <div className="mt-4 space-y-4 text-martha-charcoal/90 leading-relaxed">
                {listing.overview
                  .split(/\n{2,}/)
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
              </div>
            </div>

            {listing.additionalSections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg sm:text-xl font-bold text-martha-black break-words">
                  {section.title}
                </h2>
                <p className="mt-3 text-martha-charcoal/90 leading-relaxed whitespace-pre-line">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          <aside className="lg:col-span-2 min-w-0">
            <div className="lg:sticky lg:top-24 rounded-lg border border-martha-sand bg-martha-cream p-5 sm:p-6 md:p-8 space-y-5">
              <h2 className="text-lg font-bold text-martha-black">
                Investment summary
              </h2>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-martha-charcoal/70 font-medium">Plot size</dt>
                  <dd className="mt-1 text-martha-black font-semibold">
                    {listing.plotSize}
                  </dd>
                </div>
                <div>
                  <dt className="text-martha-charcoal/70 font-medium">Price</dt>
                  <dd className="mt-1 text-martha-black font-semibold text-lg">
                    {listing.price}
                  </dd>
                </div>
                <div>
                  <dt className="text-martha-charcoal/70 font-medium">Deposit</dt>
                  <dd className="mt-1 text-martha-black font-semibold">
                    {listing.deposit}
                  </dd>
                </div>
                <div>
                  <dt className="text-martha-charcoal/70 font-medium">
                    Balance
                  </dt>
                  <dd className="mt-1 text-martha-charcoal/90 leading-relaxed">
                    {listing.balanceTerms}
                  </dd>
                </div>
              </dl>
              <Link
                href={`/contact?property=${encodeURIComponent(listing.slug)}`}
                className="flex w-full items-center justify-center min-h-[44px] text-center px-5 py-3 bg-martha-black text-martha-cream font-medium rounded-lg hover:bg-martha-charcoal transition-colors touch-manipulation"
              >
                Enquire about this property
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
