import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft } from "lucide-react";
import { getPublishedBlogBySlug } from "@/lib/data/queries";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedBlogBySlug(slug);
  if (!post) return { title: "Blog | Martha Properties" };
  return {
    title: `${post.title} | Martha Properties`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedBlogBySlug(slug);
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
          <p className="whitespace-pre-wrap">{post.body}</p>
        </div>
        <Link href="/blogs" className="inline-block mt-8 text-martha-warm font-medium hover:underline">
          ← All posts
        </Link>
      </div>
    </div>
  );
}
