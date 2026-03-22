"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-posts";

const posts = BLOG_POSTS;

function formatDate(iso: string) {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function BlogsPage() {
  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-left sm:mb-12"
        >
          <h1 className="text-3xl font-bold tracking-tight text-martha-black md:text-4xl">
            Blog
          </h1>
        </motion.header>

        <ul className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post, i) => (
            <motion.li
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="min-w-0"
            >
              <article className="group flex h-full min-h-[280px] flex-col overflow-hidden rounded-xl border border-martha-sand bg-white shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-martha-warm/35 hover:shadow-md">
                <div className="relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-martha-sand via-martha-cream to-martha-sand/80">
                  <BookOpen
                    className="size-10 text-martha-warm/40 transition-transform duration-300 group-hover:scale-105 group-hover:text-martha-warm/55"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(184,134,11,0.06)_100%)]"
                    aria-hidden
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-xs font-medium text-martha-charcoal/65">
                    <Calendar className="size-3.5 shrink-0" aria-hidden />
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </div>
                  <h2 className="mt-3 line-clamp-2 text-base font-semibold leading-snug text-martha-black group-hover:text-martha-warm sm:text-[1.05rem]">
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-martha-warm focus-visible:ring-offset-2 rounded-sm"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-martha-charcoal/85">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-martha-warm transition-colors hover:gap-2 sm:min-h-0"
                  >
                    Read more <ArrowRight className="size-4 shrink-0" aria-hidden />
                  </Link>
                </div>
              </article>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-12 rounded-xl border border-martha-sand bg-martha-sand/50 p-6 sm:p-7"
        >
          <p className="text-sm text-martha-charcoal/90">
            New articles are added regularly. Have a topic you&apos;d like us to cover?{" "}
            <Link href="/contact" className="font-semibold text-martha-warm hover:underline">
              Get in touch
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
