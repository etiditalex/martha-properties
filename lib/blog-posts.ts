/** Blog posts — shared by /blogs and sidebar widgets */
export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "first-time-buyer-tips",
    title: "First-time buyer tips for the Kenyan market",
    date: "2024-03-10",
    excerpt:
      "What to consider when buying your first home: budget, location, and legal steps.",
  },
  {
    slug: "rental-yield-nairobi",
    title: "Understanding rental yields in Nairobi",
    date: "2024-02-28",
    excerpt:
      "A quick look at areas and property types that tend to perform well for landlords.",
  },
  {
    slug: "title-deeds-explained",
    title: "Title and deed processing: what to expect",
    date: "2024-02-15",
    excerpt:
      "How the process works and how long it typically takes when buying land or property.",
  },
];

/** Latest first — for sidebars */
export const RECENT_BLOG_POSTS = [...BLOG_POSTS].sort((a, b) =>
  b.date.localeCompare(a.date)
);
