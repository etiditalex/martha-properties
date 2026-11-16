import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Book a viewing",
  description:
    "Book a property viewing with Martha Properties. Share the property you want to see and a preferred time, and the team will confirm the visit.",
  path: "/booking",
});

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
