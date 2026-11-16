import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "About Martha Jael",
  description:
    "Martha Jael is the founder of Martha Properties, a Kenyan real estate consultancy helping clients buy, sell, rent, and invest with clear guidance.",
  path: "/about",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
