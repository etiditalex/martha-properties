"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Heart, Shield, Sparkles, Target, Users } from "lucide-react";

type Value = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const values: Value[] = [
  {
    icon: Shield,
    title: "Integrity",
    text: "Upholding the highest standards of honesty and strong moral principles in all our transactions.",
  },
  {
    icon: Sparkles,
    title: "Excellence",
    text: "Striving for excellence in every aspect of our work, from customer service to property management.",
  },
  {
    icon: Heart,
    title: "Customer focus",
    text: "Prioritising the needs and satisfaction of our clients and ensuring their real estate goals are achieved.",
  },
  {
    icon: Target,
    title: "Innovation",
    text: "Embracing new technologies and innovative approaches to enhance the real estate experience.",
  },
  {
    icon: Users,
    title: "Community",
    text: "Contributing positively to the communities we serve through sustainable and responsible practices.",
  },
];

function ValueCard({
  value,
  index,
  className = "",
}: {
  value: Value;
  index: number;
  className?: string;
}) {
  const Icon = value.icon;
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.li
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-martha-sand/90 bg-white/90 p-6 shadow-[0_20px_50px_-28px_rgba(26,26,26,0.22)] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-martha-warm/25 motion-safe:hover:shadow-[0_28px_60px_-24px_rgba(26,26,26,0.28)] sm:p-7 ${className}`}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-martha-warm/[0.06] blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-martha-warm/20 to-martha-warm/5 text-martha-warm ring-1 ring-martha-warm/15 sm:size-14">
          <Icon className="size-6 sm:size-7" strokeWidth={1.65} aria-hidden />
        </div>
        <span
          className="font-mono text-[0.65rem] font-semibold tabular-nums tracking-widest text-martha-charcoal/35"
          aria-hidden
        >
          {num}
        </span>
      </div>
      <h3 className="relative mt-5 text-lg font-bold tracking-tight text-martha-black sm:text-xl">
        {value.title}
      </h3>
      <p className="relative mt-3 text-sm leading-relaxed text-martha-charcoal/88 sm:text-[0.9375rem]">
        {value.text}
      </p>
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-martha-warm to-martha-warm/40 transition-[width] duration-500 ease-out group-hover:w-full motion-reduce:group-hover:w-0"
        aria-hidden
      />
    </motion.li>
  );
}

export function CoreValuesSection() {
  const primary = values.slice(0, 3);
  const secondary = values.slice(3);

  return (
    <section
      className="relative isolate overflow-hidden section-padding bg-gradient-to-b from-martha-cream via-white to-martha-cream"
      aria-labelledby="core-values-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(26,26,26,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,26,0.03)_1px,transparent_1px)] [background-size:48px_48px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[min(100%,720px)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(184,134,11,0.09),transparent_65%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="core-values-heading"
            className="text-3xl font-bold tracking-tight text-martha-black sm:text-4xl"
          >
            Core values
          </h2>
        </motion.div>

        <ul className="mt-12 grid list-none gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {primary.map((v, i) => (
            <ValueCard key={v.title} value={v} index={i} />
          ))}
        </ul>

        <ul className="mt-5 grid list-none gap-5 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:mx-auto lg:max-w-4xl">
          {secondary.map((v, i) => (
            <ValueCard key={v.title} value={v} index={i + 3} />
          ))}
        </ul>
      </div>
    </section>
  );
}
