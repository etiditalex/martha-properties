"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Check } from "lucide-react";

const field =
  "w-full min-h-[44px] px-4 py-3 border border-martha-sand rounded-lg bg-white text-base text-martha-black placeholder:text-martha-charcoal/50 focus:outline-none focus:ring-2 focus:ring-martha-warm/50 touch-manipulation";

export default function BookingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          preferredDate: form.get("preferred-date"),
          preferredTime: form.get("preferred-time"),
          propertyName: form.get("property"),
          message: form.get("notes"),
        }),
      });
      if (!response.ok) {
        setError("We couldn’t send that just now. Please call us instead.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("We couldn’t send that just now. Please call us instead.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto w-full min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-martha-black break-words">Book a viewing</h1>
          <p className="mt-2 text-martha-charcoal/90">
            Tell us when you’re free and which property or area you’re interested in. We’ll confirm and arrange a suitable time.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-martha-sand rounded-lg text-center"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-martha-warm text-martha-black mb-4">
              <Check size={24} />
            </div>
            <h2 className="text-xl font-semibold text-martha-black">Request received</h2>
            <p className="mt-2 text-martha-charcoal/90">
              We’ll be in touch shortly to confirm your viewing. If you need to change anything, give us a call on +254 732 868220.
            </p>
            <Link
              href="/"
              className="inline-block mt-6 text-martha-warm font-medium hover:underline"
            >
              Back to home
            </Link>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-martha-charcoal mb-1">
                Your name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={field}
                placeholder="Full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-martha-charcoal mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={field}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-martha-charcoal mb-1">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className={field}
                placeholder="+254 7XX XXX XXX"
              />
            </div>
            <div>
              <label htmlFor="preferred-date" className="block text-sm font-medium text-martha-charcoal mb-1">
                Preferred date
              </label>
              <input
                id="preferred-date"
                name="preferred-date"
                type="date"
                className={field}
              />
            </div>
            <div>
              <label htmlFor="preferred-time" className="block text-sm font-medium text-martha-charcoal mb-1">
                Preferred time
              </label>
              <select
                id="preferred-time"
                name="preferred-time"
                className={field}
              >
                <option value="">Select</option>
                <option value="morning">Morning (9am – 12pm)</option>
                <option value="afternoon">Afternoon (12pm – 5pm)</option>
                <option value="evening">Evening (5pm – 7pm)</option>
              </select>
            </div>
            <div>
              <label htmlFor="property" className="block text-sm font-medium text-martha-charcoal mb-1">
                Property or area of interest
              </label>
              <input
                id="property"
                name="property"
                type="text"
                className={field}
                placeholder="e.g. Karen 4-bed, or Westlands area"
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-martha-charcoal mb-1">
                Additional notes (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className={`${field} min-h-[100px] resize-y`}
                placeholder="Any specific requirements or questions"
              />
            </div>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 bg-martha-black text-martha-cream font-medium rounded-lg hover:bg-martha-charcoal transition-colors touch-manipulation disabled:opacity-60"
            >
              <Calendar size={18} /> {submitting ? "Sending…" : "Request viewing"}
            </button>
          </motion.form>
        )}

        <p className="mt-8 text-sm text-martha-charcoal/70">
          You can also call us directly to book:{" "}
          <a href="tel:+254732868220" className="text-martha-warm font-medium hover:underline">
            +254 732 868220
          </a>
        </p>
      </div>
    </div>
  );
}
