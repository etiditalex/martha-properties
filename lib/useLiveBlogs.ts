"use client";

import { useEffect, useState } from "react";
import { BLOG_POSTS, RECENT_BLOG_POSTS, type BlogPost } from "@/lib/blog-posts";

export function useLiveBlogs() {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blogs")
      .then((response) => response.json())
      .then((data: { source?: string; posts?: BlogPost[] }) => {
        if (!cancelled && data.source === "database" && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const recent = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  return { posts, recent: recent.length ? recent : RECENT_BLOG_POSTS };
}
