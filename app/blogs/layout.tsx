import { JsonLd } from "@/components/JsonLd";
import { getPublishedBlogs } from "@/lib/data/queries";
import { blogsItemList, buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Property guides",
  description:
    "Guides from Martha Properties on buying property in Kenya, rental yields, title deeds, and what first-time buyers should check before they commit.",
  path: "/blogs",
  keepTemplate: true,
});

export default async function BlogsLayout({ children }: { children: React.ReactNode }) {
  const { posts } = await getPublishedBlogs();
  return (
    <>
      <JsonLd data={blogsItemList(posts)} />
      {children}
    </>
  );
}
