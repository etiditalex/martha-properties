import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft } from "lucide-react";

const posts: Record<string, { title: string; date: string; body: string }> = {
  "first-time-buyer-tips": {
    title: "First-time buyer tips for the Kenyan market",
    date: "2024-03-10",
    body: "Buying your first home is a big step. Start by being clear on your budget — not just the purchase price but also legal fees, stamp duty, and any renovations. Location matters: think about commute, security, and future resale. Always work with a lawyer for conveyancing and do a search on the title to confirm ownership and any encumbrances. Take your time to view several properties and don’t feel pressured to decide on the spot.",
  },
  "rental-yield-nairobi": {
    title: "Understanding rental yields in Nairobi",
    date: "2024-02-28",
    body: "Rental yield is the annual rent you earn as a percentage of the property’s value. In Nairobi, yields vary by area and property type. Apartments in well-serviced areas often offer steady demand, while standalone houses can attract families and longer tenancies. Consider management costs, vacancy periods, and maintenance when comparing yields. We can help you assess specific areas and property types based on your investment goals.",
  },
  "title-deeds-explained": {
    title: "Title and deed processing: what to expect",
    date: "2024-02-15",
    body: "When you buy land or property, the transfer of ownership is completed through title and deed processing. This involves the land registry and sometimes local authorities. Timelines can vary — from a few weeks to several months — depending on the type of transaction and the area. We work with experienced advocates and can guide you through the process, helping with documentation and follow-up so you know what to expect at each stage.",
  },
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];
  if (!post) notFound();

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1 text-martha-charcoal/80 hover:text-martha-warm text-sm font-medium mb-8"
        >
          <ArrowLeft size={16} /> Back to blog
        </Link>
        <div className="flex items-center gap-2 text-sm text-martha-charcoal/70">
          <Calendar size={14} />
          <time dateTime={post.date}>{post.date}</time>
        </div>
        <h1 className="mt-2 text-2xl md:text-3xl font-bold text-martha-black">{post.title}</h1>
        <div className="mt-6 prose-martha text-martha-charcoal/90">
          <p>{post.body}</p>
        </div>
        <Link href="/blogs" className="inline-block mt-8 text-martha-warm font-medium hover:underline">
          ← All posts
        </Link>
      </div>
    </div>
  );
}
