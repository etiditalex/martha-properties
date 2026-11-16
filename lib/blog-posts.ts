/** Blog posts — shared by /blogs and sidebar widgets */
export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body?: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "first-time-buyer-tips",
    title: "First-time buyer tips for the Kenyan market",
    date: "2024-03-10",
    excerpt:
      "What to consider when buying your first home: budget, location, and legal steps.",
    body: "Buying your first home is a big step. Start by being clear on your budget — not just the purchase price but also legal fees, stamp duty, and any renovations. Location matters: think about commute, security, and future resale. Always work with a lawyer for conveyancing and do a search on the title to confirm ownership and any encumbrances. Take your time to view several properties and don’t feel pressured to decide on the spot.",
  },
  {
    slug: "rental-yield-nairobi",
    title: "Understanding rental yields in Nairobi",
    date: "2024-02-28",
    excerpt:
      "A quick look at areas and property types that tend to perform well for landlords.",
    body: "Rental yield is the annual rent you earn as a percentage of the property’s value. In Nairobi, yields vary by area and property type. Apartments in well-serviced areas often offer steady demand, while standalone houses can attract families and longer tenancies. Consider management costs, vacancy periods, and maintenance when comparing yields. We can help you assess specific areas and property types based on your investment goals.",
  },
  {
    slug: "title-deeds-explained",
    title: "Title and deed processing: what to expect",
    date: "2024-02-15",
    excerpt:
      "How the process works and how long it typically takes when buying land or property.",
    body: "When you buy land or property, the transfer of ownership is completed through title and deed processing. This involves the land registry and sometimes local authorities. Timelines can vary — from a few weeks to several months — depending on the type of transaction and the area. We work with experienced advocates and can guide you through the process, helping with documentation and follow-up so you know what to expect at each stage.",
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/** Latest first — for sidebars */
export const RECENT_BLOG_POSTS = [...BLOG_POSTS].sort((a, b) =>
  b.date.localeCompare(a.date)
);
