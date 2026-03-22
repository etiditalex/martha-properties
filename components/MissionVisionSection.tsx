"use client";

import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";

const missionText =
  "To provide exceptional real estate services that exceed client expectations and to become a trusted industry leader known for excellence, innovation, and outstanding results.";

const visionText =
  "To set the standard for professionalism and client satisfaction in the real estate industry by building lasting relationships and delivering consistent value.";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const bridgeItem = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

export function MissionVisionSection() {
  return (
    <section
      className="relative isolate overflow-hidden section-padding bg-gradient-to-b from-martha-sand via-martha-cream to-martha-cream"
      aria-labelledby="mission-vision-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(184,134,11,0.12),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-martha-warm/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-martha-black/[0.04] blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2
            id="mission-vision-heading"
            className="text-3xl font-bold tracking-tight text-martha-black sm:text-4xl md:text-[2.35rem] md:leading-tight"
          >
            Mission <span className="text-martha-charcoal/40 font-light">&</span> vision
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch lg:gap-6"
        >
          {/* Mission */}
          <motion.article
            variants={item}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-martha-sand/80 bg-white/90 p-8 shadow-[0_24px_60px_-28px_rgba(26,26,26,0.28)] backdrop-blur-sm transition-[transform,box-shadow] duration-300 motion-safe:lg:hover:-translate-y-1 motion-safe:lg:hover:shadow-[0_32px_70px_-28px_rgba(26,26,26,0.35)] sm:p-9 lg:min-h-[280px]"
          >
            <div
              className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-martha-warm via-martha-warm/80 to-martha-warm/30"
              aria-hidden
            />
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              <div className="flex shrink-0 justify-center sm:block">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-martha-warm/20 to-martha-warm/5 text-martha-warm shadow-inner ring-1 ring-martha-warm/20 sm:size-[4.5rem]">
                  <Target className="size-8 sm:size-9" strokeWidth={1.75} aria-hidden />
                </div>
              </div>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-martha-warm">
                  Mission
                </h3>
                <p className="mt-4 text-lg font-medium leading-snug text-martha-black sm:text-xl sm:leading-snug">
                  {missionText}
                </p>
              </div>
            </div>
            <div
              className="pointer-events-none absolute -bottom-8 right-6 h-32 w-32 rounded-full bg-martha-warm/[0.07] blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              aria-hidden
            />
          </motion.article>

          {/* Vision */}
          {/* Bridge between mission & vision (desktop) */}
          <motion.div
            variants={bridgeItem}
            className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-1"
            aria-hidden
          >
            <span className="h-full min-h-[120px] w-px max-h-[70%] bg-gradient-to-b from-transparent via-martha-warm/50 to-transparent" />
            <span className="my-3 size-2.5 shrink-0 rounded-full bg-martha-warm shadow-[0_0_12px_rgba(184,134,11,0.45)]" />
            <span className="h-full min-h-[120px] w-px max-h-[70%] bg-gradient-to-b from-transparent via-martha-warm/50 to-transparent" />
          </motion.div>

          <motion.article
            variants={item}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-martha-charcoal/20 bg-martha-black p-8 text-martha-cream shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)] transition-[transform,box-shadow] duration-300 motion-safe:lg:hover:-translate-y-1 motion-safe:lg:hover:shadow-[0_36px_80px_-28px_rgba(0,0,0,0.5)] sm:p-9 lg:min-h-[280px]"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(184,134,11,0.08)_0%,transparent_45%,rgba(255,255,255,0.03)_100%)]"
              aria-hidden
            />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              <div className="flex shrink-0 justify-center sm:block">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-martha-warm/15 text-martha-warm ring-1 ring-martha-warm/30 sm:size-[4.5rem]">
                  <Eye className="size-8 sm:size-9" strokeWidth={1.75} aria-hidden />
                </div>
              </div>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-martha-warm">
                  Vision
                </h3>
                <p className="mt-4 text-lg font-medium leading-snug text-martha-cream/95 sm:text-xl sm:leading-snug">
                  {visionText}
                </p>
              </div>
            </div>
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-martha-warm/10 blur-3xl"
              aria-hidden
            />
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
