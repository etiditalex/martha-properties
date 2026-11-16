import { JsonLd } from "@/components/JsonLd";
import { getPublishedListings } from "@/lib/data/queries";
import { buildPageMetadata, listingsItemList } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Properties for sale",
  description:
    "Land and homes for sale in Kenya from Martha Properties, including serviced plots in Kilifi, Malindi, Bofa, and Tezo, with prices, deposits, and payment plans.",
  path: "/for-sale",
  keepTemplate: true,
});

export default async function ForSaleLayout({ children }: { children: React.ReactNode }) {
  const { listings } = await getPublishedListings();
  return (
    <>
      <JsonLd data={listingsItemList(listings)} />
      {children}
    </>
  );
}
