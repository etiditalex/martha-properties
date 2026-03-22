"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MARTHA_PORTRAIT =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1774176468/Martha_Jael_izsszf.jpg";

const TYPEWRITER_TEXT = "About Realtor Martha";

function TypewriterAboutLabel() {
  const [display, setDisplay] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const text = TYPEWRITER_TEXT;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const clearTimer = () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const schedule = (fn: () => void, ms: number) => {
      clearTimer();
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        fn();
      }, ms);
    };

    let cancelled = false;
    let idx = 0;
    let forward = true;

    const runStatic = () => {
      clearTimer();
      setDisplay(text);
    };

    const step = () => {
      if (cancelled) return;

      if (mq.matches) {
        runStatic();
        return;
      }

      if (forward) {
        if (idx < text.length) {
          idx += 1;
          setDisplay(text.slice(0, idx));
          schedule(step, 62);
        } else {
          schedule(() => {
            forward = false;
            step();
          }, 2600);
        }
      } else if (idx > 0) {
        idx -= 1;
        setDisplay(text.slice(0, idx));
        schedule(step, 36);
      } else {
        schedule(() => {
          forward = true;
          step();
        }, 800);
      }
    };

    if (mq.matches) {
      setDisplay(text);
    } else {
      setDisplay("");
      idx = 0;
      forward = true;
      step();
    }

    const onPrefChange = () => {
      if (mq.matches) {
        cancelled = true;
        clearTimer();
        setDisplay(text);
      } else {
        cancelled = false;
        clearTimer();
        idx = 0;
        forward = true;
        setDisplay("");
        step();
      }
    };

    mq.addEventListener("change", onPrefChange);

    return () => {
      cancelled = true;
      clearTimer();
      mq.removeEventListener("change", onPrefChange);
    };
  }, []);

  return (
    <div
      className="inline-flex max-w-[calc(100vw-2rem)] items-center rounded-2xl border border-martha-sand/90 bg-white/85 px-4 py-2.5 shadow-[0_8px_30px_-12px_rgba(26,26,26,0.2)] backdrop-blur-md sm:px-5 sm:py-3"
      role="status"
      aria-live="polite"
      aria-label={TYPEWRITER_TEXT}
    >
      <span className="sr-only">{TYPEWRITER_TEXT}</span>
      <span
        className="text-sm font-semibold tracking-tight text-martha-black sm:text-base md:text-lg"
        aria-hidden
      >
        {display}
      </span>
      <span
        className="ml-0.5 inline-block h-[1.05em] w-0.5 translate-y-px bg-martha-warm motion-safe:animate-about-cursor"
        aria-hidden
      />
    </div>
  );
}

export function AboutHero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-martha-cream via-martha-cream to-martha-sand/40">
      {/* Soft depth — no harsh contrast */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-martha-warm/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 h-[22rem] w-[22rem] rounded-full bg-martha-sand blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(248,246,243,0.4)_45%,transparent_70%)]"
        aria-hidden
      />

      {/* Top-left corner — deleting / typing “About Realtor Martha” */}
      <div
        className="pointer-events-none absolute left-[max(1rem,env(safe-area-inset-left,0px))] top-5 z-20 sm:top-7 md:top-8 lg:left-[max(1rem,calc(50vw-36rem+1rem))] xl:left-[max(1rem,calc(50vw-36rem+1.5rem))]"
      >
        <div className="pointer-events-auto">
          <TypewriterAboutLabel />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 md:pb-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(260px,380px)] lg:gap-14 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 min-w-0 lg:order-1"
          >
            <h1 className="text-3xl font-bold tracking-tight text-martha-black sm:text-4xl md:text-[2.75rem] md:leading-[1.12]">
              About{" "}
              <span className="text-martha-warm">Realtor Martha</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-martha-charcoal/90 sm:text-lg">
              Martha Jael is a dedicated, client-focused real estate professional
              committed to delivering exceptional property solutions. With over
              six years of industry experience, she specialises in residential
              sales, rentals, investment advisory, and property management.
            </p>
            <p className="mt-4 text-base leading-relaxed text-martha-charcoal/88 sm:text-[1.05rem]">
              Built on integrity, professionalism, and innovation, Realtor
              Martha provides personalised real estate services tailored to each
              client&apos;s needs — whether you&apos;re a first-time buyer,
              investor, landlord, or seller.
            </p>
          </motion.div>

          <motion.figure
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 mx-auto w-full max-w-[min(100%,320px)] lg:order-2 lg:mx-0 lg:max-w-none"
          >
            <div className="relative">
              {/* Accent frame */}
              <div
                className="absolute -inset-3 rounded-[1.35rem] bg-gradient-to-br from-martha-warm/25 via-transparent to-martha-sand opacity-80 blur-sm motion-reduce:opacity-60"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-2xl bg-martha-sand shadow-[0_28px_70px_-20px_rgba(26,26,26,0.45)] ring-2 ring-white ring-offset-4 ring-offset-martha-cream sm:rounded-[1.35rem] sm:ring-offset-[1.15rem]">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={MARTHA_PORTRAIT}
                    alt="Martha Jael, Real Estate Consultant and founder"
                    fill
                    className="object-cover object-[center_18%]"
                    sizes="(max-width: 1024px) 320px, 380px"
                    priority
                  />
                </div>
              </div>
              {/* Subtle credential strip */}
              <figcaption className="mt-5 flex flex-col gap-1 text-center sm:text-left">
                <span className="text-lg font-semibold text-martha-black">
                  Martha Jael
                </span>
                <span className="text-sm text-martha-charcoal/70">
                  Founder &amp; Real Estate Consultant
                </span>
              </figcaption>
            </div>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
