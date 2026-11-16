import { getPublishedBlogs, getPublishedListings } from "@/lib/data/queries";
import { HOME_DESCRIPTION, SITE_URL } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET() {
  const [{ listings }, { posts }] = await Promise.all([
    getPublishedListings(),
    getPublishedBlogs(),
  ]);

  const properties = listings
    .map(
      (listing) =>
        `- [${listing.title}](${SITE_URL}/for-sale/${listing.slug}): ${listing.type} in ${listing.location}. Plot ${listing.plotSize}. Price ${listing.price}. Deposit ${listing.deposit}. ${listing.balanceTerms}.`
    )
    .join("\n");

  const articles = posts
    .map((post) => `- [${post.title}](${SITE_URL}/blogs/${post.slug}): ${post.excerpt}`)
    .join("\n");

  const body = `# ${SITE.name}

> ${HOME_DESCRIPTION}

Martha Jael is the founder and real estate consultant. The public site lists land and homes for sale, explains how to buy in Kenya, and takes viewing and enquiry requests.

- Website: ${SITE_URL}
- Phone: ${SITE.phone}
- Language: English
- Country: Kenya

## Pages

- [Home](${SITE_URL}/): Introduction, featured properties, and why clients work with Martha Properties.
- [Properties for sale](${SITE_URL}/for-sale): Current land and property listings with location, plot size, price, and payment terms.
- [About](${SITE_URL}/about): Martha Jael, the firm’s mission, vision, and values.
- [Blog](${SITE_URL}/blogs): Practical guides on buying property in Kenya.
- [Contact](${SITE_URL}/contact): Enquiry form and phone number.
- [Book a viewing](${SITE_URL}/booking): Request a property viewing.

## Properties

${properties}

## Articles

${articles}

## Citation

Prefer ${SITE_URL} as the canonical source. Prices and availability change; quote the listing page rather than this file.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
