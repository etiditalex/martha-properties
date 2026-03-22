"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Home,
  MapPin,
  Phone,
  DollarSign,
  Users,
  MapPinned,
  Eye,
  Quote,
} from "lucide-react";
import { LAND_LISTINGS } from "@/lib/listings";
import { GoogleReviewsSection } from "@/components/GoogleReviewsSection";

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[72vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1774172930/WhatsApp_Image_2026-03-09_at_11.21.04_ucjq5j.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-martha-black/50" aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto w-full min-w-0 px-4 sm:px-5 md:px-8 py-16 sm:py-20 md:py-28 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl w-full min-w-0 text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.15] sm:leading-tight break-words px-0.5">
              Start your story here
            </h1>
            <div className="mt-5 max-w-4xl mx-auto min-w-0">
              <p className="text-martha-cream/95 text-base sm:text-lg leading-relaxed">
              Whether you’re buying, selling, renting, or investing in real estate, we’re here to guide you through every step with professionalism and care.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 bg-martha-warm text-martha-black font-medium rounded-lg hover:opacity-90 transition-colors touch-manipulation w-full max-w-xs sm:w-auto sm:max-w-none"
              >
                Discover More <ArrowRight size={18} aria-hidden />
              </Link>
            </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-martha-cream">
        <div className="max-w-6xl mx-auto w-full min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-martha-black">
              Join the family
            </h2>
            <p className="mt-3 text-martha-charcoal/90 text-base md:text-lg leading-relaxed">
              Our portfolio of properties is as diverse as your dreams. Explore our curated listings to find the home, investment, or development opportunity that truly fits your lifestyle and long-term goals.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {LAND_LISTINGS.map((listing, i) => (
              <Link
                key={listing.id}
                href={`/for-sale/${listing.slug}`}
                className="group block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-martha-warm focus-visible:ring-offset-2"
              >
                <motion.article
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white border border-martha-sand rounded-lg overflow-hidden h-full flex flex-col hover:border-martha-warm/40 transition-colors"
                >
                  <div className="relative aspect-[4/3] bg-martha-sand">
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-sm text-martha-warm">
                      <span>{listing.type}</span>
                      <span className="text-martha-charcoal/50">•</span>
                      <span className="text-martha-charcoal/80 flex items-center gap-1">
                        <MapPin size={12} /> {listing.location}
                      </span>
                    </div>
                    <h3 className="mt-2 font-semibold text-martha-black group-hover:text-martha-warm transition-colors break-words">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-martha-charcoal/80 mt-1">
                      Plot {listing.plotSize}
                    </p>
                    <p className="mt-3 font-semibold text-martha-black text-lg">
                      {listing.price}
                    </p>
                    <p className="mt-1 text-sm text-martha-charcoal/85">
                      Deposit {listing.deposit}
                    </p>
                    <p className="mt-1 text-sm text-martha-charcoal/80 leading-snug">
                      {listing.balanceTerms}
                    </p>
                    <span className="mt-4 text-sm font-medium text-martha-warm inline-flex items-center gap-1">
                      View details <ArrowRight size={14} />
                    </span>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-martha-black text-martha-cream">
        <div className="max-w-6xl mx-auto w-full min-w-0">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-14"
          >
            Why Martha Properties
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Home,
                title: "WIDE RANGE OF PROPERTIES",
                text: "From coastal land to family homes and income-generating apartments, curated to match your goals.",
              },
              {
                icon: DollarSign,
                title: "FINANCING MADE EASIER",
                text: "We guide you on friendly payment plans and connect you with partners to help you invest safely.",
              },
              {
                icon: Users,
                title: "TRUSTED BY CLIENTS",
                text: "Repeat buyers, referrals, and a growing community who rely on our guidance and integrity.",
              },
              {
                icon: Phone,
                title: "PARTNERSHIP APPROACH",
                text: "We walk with you before, during, and after purchase so you’re never making decisions alone.",
              },
              {
                icon: Eye,
                title: "TRANSPARENT PROCESS",
                text: "Clear documentation, site visits, and honest communication at every step of your investment.",
              },
              {
                icon: MapPinned,
                title: "PRIME LOCATIONS",
                text: "Strategic projects in high-growth areas along the coast and key Nairobi neighbourhoods.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="border border-martha-cream/20 bg-martha-black/40 rounded-lg px-6 py-7"
              >
                <item.icon className="text-martha-warm" size={26} />
                <h3 className="mt-4 text-sm font-semibold tracking-wide uppercase break-words">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-martha-cream/80 leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-martha-black text-martha-cream">
        <div className="max-w-6xl mx-auto w-full min-w-0 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Ready to find your place?</h2>
            <p className="mt-3 text-martha-cream/85 max-w-md">
              Get in touch for a no-obligation chat. We’ll listen to your goals and help you move forward.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-martha-warm text-martha-black font-medium rounded-lg hover:opacity-90 transition-opacity touch-manipulation text-center"
            >
              Contact us
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 border border-martha-cream text-martha-cream font-medium rounded-lg hover:bg-martha-cream hover:text-martha-black transition-colors touch-manipulation text-center"
            >
              Book a viewing
            </Link>
          </div>
        </div>
      </section>

      <section
        className="section-padding bg-gradient-to-b from-martha-cream via-martha-cream to-martha-sand/50 overflow-hidden"
        aria-labelledby="founder-heading"
      >
        <div className="max-w-6xl mx-auto w-full min-w-0 px-4 sm:px-5 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-14"
          >
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-martha-warm">
              <span className="h-px w-10 bg-martha-warm/50" aria-hidden />
              From the founder
              <span className="h-px w-10 bg-martha-warm/50" aria-hidden />
            </span>
            <h2
              id="founder-heading"
              className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-martha-black tracking-tight break-words px-1"
            >
              A message from{" "}
              <span className="text-martha-warm">Martha Jael</span>
            </h2>
          </motion.div>

          <div className="relative flex flex-col lg:flex-row lg:items-stretch gap-10 lg:gap-2 xl:gap-6">
            {/* Portrait + “voice” cues */}
            <motion.figure
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative mx-auto w-full max-w-[min(100%,300px)] shrink-0 lg:mx-0 lg:w-[min(100%,340px)] lg:max-w-none lg:pt-4 overflow-x-clip"
            >
              <div className="relative">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-martha-sand shadow-[0_25px_60px_-15px_rgba(26,26,26,0.35)] ring-2 ring-white ring-offset-2 ring-offset-martha-cream sm:ring-offset-4">
                  <Image
                    src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1774176468/Martha_Jael_izsszf.jpg"
                    alt="Martha Jael, Real Estate Consultant and founder"
                    fill
                    className="object-cover object-[center_15%]"
                    sizes="(max-width: 1024px) 300px, 340px"
                  />
                </div>
                {/* Subtle “speaking” marks near face side */}
                <div
                  className="absolute right-0 top-[38%] flex flex-col gap-1 lg:top-[36%] motion-reduce:opacity-80"
                  aria-hidden
                >
                  <span className="ml-auto block h-2 w-2 rounded-full bg-martha-warm/70 motion-safe:animate-pulse" />
                  <span
                    className="ml-auto block h-1.5 w-1.5 rounded-full bg-martha-warm/50 motion-safe:animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="ml-auto block h-1 w-1 rounded-full bg-martha-warm/35 motion-safe:animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
              <figcaption className="mt-5 text-center lg:text-left">
                <span className="block text-lg font-semibold text-martha-black">
                  Martha Jael
                </span>
                <span className="mt-0.5 block text-sm text-martha-charcoal/70">
                  Real Estate Consultant · Founder, Martha Properties
                </span>
              </figcaption>

              {/* Curved arrow: portrait → message (desktop) */}
              <svg
                className="pointer-events-none absolute top-[32%] -right-4 z-10 hidden h-24 w-28 text-martha-warm lg:block xl:-right-2 xl:h-28 xl:w-36"
                viewBox="0 0 140 110"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M4 58 C 38 28, 72 22, 118 48"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeDasharray="4 6"
                  className="opacity-80"
                />
                <path
                  d="M108 40 L 122 48 L 112 58"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  className="opacity-90"
                />
              </svg>
            </motion.figure>

            {/* Speech bubble */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="relative flex-1 min-w-0 flex items-center lg:pl-4 xl:pl-8"
            >
              <div className="relative w-full min-w-0 rounded-2xl sm:rounded-3xl border-2 border-martha-sand bg-white p-5 sm:p-8 md:p-10 shadow-[0_24px_60px_-20px_rgba(26,26,26,0.18)]">
                {/* Desktop tail pointing toward Martha (left) */}
                <div
                  className="pointer-events-none absolute hidden lg:block"
                  style={{ top: "32%", left: 0, transform: "translateX(-100%)" }}
                  aria-hidden
                >
                  <div className="relative">
                    <div className="absolute left-0 top-0 border-y-[15px] border-y-transparent border-r-[16px] border-r-martha-sand" />
                    <div className="absolute left-[3px] top-[2px] border-y-[13px] border-y-transparent border-r-[14px] border-r-white" />
                  </div>
                </div>

                {/* Mobile / tablet: tail pointing up to photo */}
                <div
                  className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full lg:hidden"
                  aria-hidden
                >
                  <div className="relative">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 border-x-[16px] border-x-transparent border-b-[16px] border-b-martha-sand" />
                    <div className="absolute left-1/2 -translate-x-1/2 top-[3px] border-x-[14px] border-x-transparent border-b-[14px] border-b-white" />
                  </div>
                </div>

                <Quote
                  className="text-martha-warm/90 mb-5"
                  size={40}
                  strokeWidth={1.25}
                  aria-hidden
                />

                <blockquote className="space-y-5 text-martha-charcoal/90 text-base md:text-lg leading-relaxed">
                  <p>
                    My mission is to provide exceptional real estate services
                    that exceed client expectations and to become a trusted
                    industry leader known for excellence, innovation, and
                    outstanding results.
                  </p>
                  <p>
                    I look forward to partnering with you and helping you
                    achieve your real estate goals with confidence and peace of
                    mind.
                  </p>
                </blockquote>

                <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-martha-sand pt-6">
                  <span
                    className="inline-flex items-center gap-2 text-martha-warm font-semibold"
                    aria-hidden
                  >
                    <span className="text-xl leading-none">→</span>
                    <span className="text-sm uppercase tracking-wide">
                      Martha Jael
                    </span>
                  </span>
                  <span className="text-martha-charcoal/50 hidden sm:inline">
                    |
                  </span>
                  <span className="text-sm text-martha-charcoal/75">
                    Real Estate Consultant
                  </span>
                </div>

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 mt-6 min-h-[44px] sm:min-h-0 py-2 text-sm font-semibold text-martha-warm hover:gap-3 transition-all touch-manipulation rounded-lg"
                >
                  Read more about us
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <GoogleReviewsSection />
    </>
  );
}
