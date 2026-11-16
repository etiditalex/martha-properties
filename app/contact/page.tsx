"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Phone, Globe, Send } from "lucide-react";
import { getLandListingBySlug } from "@/lib/listings";
import { DEFAULT_CONTACT, type SiteContact } from "@/lib/site";

function ContactFormInner() {
  const searchParams = useSearchParams();
  const propertySlug = searchParams.get("property");
  const listing = propertySlug
    ? getLandListingBySlug(propertySlug)
    : undefined;

  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState<SiteContact>(DEFAULT_CONTACT);

  useEffect(() => {
    fetch("/api/settings")
      .then((response) => response.json())
      .then((data: SiteContact) => {
        if (data?.phone) setContact((current) => ({ ...current, ...data }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (listing) {
      setMessage(
        `I'm interested in ${listing.title} (${listing.location}). Please share next steps.`
      );
      return;
    }
    if (!propertySlug) return;
    let cancelled = false;
    fetch("/api/listings")
      .then((response) => response.json())
      .then((data: { listings?: { slug: string; title: string; location: string }[] }) => {
        const match = data.listings?.find((item) => item.slug === propertySlug);
        if (!cancelled && match) {
          setMessage(
            `I'm interested in ${match.title} (${match.location}). Please share next steps.`
          );
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [propertySlug, listing]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          message,
          listingSlug: propertySlug,
        }),
      });
      if (!response.ok) {
        setError("We couldn’t send that just now. Please call us instead.");
        return;
      }
      setSent(true);
    } catch {
      setError("We couldn’t send that just now. Please call us instead.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="section-padding">
      <div className="max-w-6xl mx-auto w-full min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-martha-black">
            Contact us
          </h1>
          <p className="mt-2 text-martha-charcoal/90 max-w-xl">
            Whether you’re looking to buy, sell, rent, or invest, we’d love to
            hear from you. Send a message or call directly.
          </p>
          {listing && (
            <p className="mt-4 text-sm rounded-lg bg-martha-sand px-4 py-3 text-martha-charcoal max-w-xl">
              You’re enquiring about{" "}
              <span className="font-semibold text-martha-black">
                {listing.title}
              </span>
              . We’ve started a message for you below — edit it as you like.
            </p>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h2 className="text-lg font-semibold text-martha-black mb-6">
              Get in touch
            </h2>
            <ul className="space-y-5">
              <li>
                <a
                  href={contact.phoneHref}
                  className="flex items-center gap-3 text-martha-charcoal hover:text-martha-warm transition-colors"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded bg-martha-sand">
                    <Phone size={18} />
                  </span>
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-martha-charcoal hover:text-martha-warm transition-colors"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded bg-martha-sand">
                    <Globe size={18} />
                  </span>
                  {contact.websiteLabel}
                </a>
              </li>
            </ul>
            <p className="mt-8 text-sm text-martha-charcoal/80">
              We aim to respond to enquiries within 24 hours. For urgent
              matters, please call.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-martha-black mb-6">
              Send a message
            </h2>
            {sent ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-martha-sand rounded-lg text-martha-charcoal"
              >
                <p className="font-medium">Thanks for your message.</p>
                <p className="mt-1 text-sm">
                  We’ll get back to you as soon as we can.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-martha-charcoal mb-1"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full min-h-[44px] px-4 py-3 border border-martha-sand rounded-lg bg-white text-base text-martha-black placeholder:text-martha-charcoal/50 focus:outline-none focus:ring-2 focus:ring-martha-warm/50 touch-manipulation"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-martha-charcoal mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full min-h-[44px] px-4 py-3 border border-martha-sand rounded-lg bg-white text-base text-martha-black placeholder:text-martha-charcoal/50 focus:outline-none focus:ring-2 focus:ring-martha-warm/50 touch-manipulation"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-martha-charcoal mb-1"
                  >
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full min-h-[44px] px-4 py-3 border border-martha-sand rounded-lg bg-white text-base text-martha-black placeholder:text-martha-charcoal/50 focus:outline-none focus:ring-2 focus:ring-martha-warm/50 touch-manipulation"
                    placeholder="+254 ..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-martha-charcoal mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full min-h-[120px] px-4 py-3 border border-martha-sand rounded-lg bg-white text-base text-martha-black placeholder:text-martha-charcoal/50 focus:outline-none focus:ring-2 focus:ring-martha-warm/50 resize-y touch-manipulation"
                    placeholder="How can we help?"
                  />
                </div>
                {error && <p className="text-sm text-red-700">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 bg-martha-black text-martha-cream font-medium rounded-lg hover:bg-martha-charcoal transition-colors touch-manipulation w-full sm:w-auto disabled:opacity-60"
                >
                  <Send size={18} /> {submitting ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactFormFallback() {
  return (
    <div className="section-padding">
      <div className="max-w-6xl mx-auto w-full min-w-0 animate-pulse">
        <div className="h-10 bg-martha-sand rounded w-1/3 mb-4" />
        <div className="h-4 bg-martha-sand rounded w-2/3 mb-12" />
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="h-6 bg-martha-sand rounded w-1/4" />
            <div className="h-20 bg-martha-sand rounded" />
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-martha-sand rounded w-1/4" />
            <div className="h-64 bg-martha-sand rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<ContactFormFallback />}>
      <ContactFormInner />
    </Suspense>
  );
}
