import type { Metadata } from "next";
import type { BlogPost } from "@/lib/blog-posts";
import type { LandListing } from "@/lib/listings";
import { LOGO_URL, SITE } from "@/lib/site";

export const SITE_URL = "https://marthaproperties.co.ke";

const CLOUDINARY_UPLOAD = "/image/upload/";
const SHARE_SIZE = "w_1200,h_630";

export const HOME_TITLE = "Martha Properties | Real Estate in Kenya";
export const HOME_DESCRIPTION =
  "Martha Properties, led by Martha Jael, helps you buy, sell, rent, and invest in land and homes across Kenya, including Kilifi, Malindi, and Nairobi.";

const FOUNDER_IMAGE =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1774176468/Martha_Jael_izsszf.jpg";

export type ShareImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  type?: string;
};

function cloudinaryShareUrl(src: string, mode: "logo" | "photo") {
  if (!src.includes("res.cloudinary.com") || !src.includes(CLOUDINARY_UPLOAD)) return null;
  if (src.includes(SHARE_SIZE)) return src;
  const transform =
    mode === "logo"
      ? `b_rgb:F8F6F3,c_pad,${SHARE_SIZE},f_jpg,q_auto`
      : `c_fill,g_auto,${SHARE_SIZE},f_jpg,q_auto`;
  return src.replace(CLOUDINARY_UPLOAD, `${CLOUDINARY_UPLOAD}${transform}/`);
}

export function shareImage(
  src: string | undefined | null,
  alt: string,
  mode: "logo" | "photo" = "photo"
): ShareImage {
  const source = src?.trim() || LOGO_URL;
  const transformed = cloudinaryShareUrl(source, source === LOGO_URL ? "logo" : mode);
  if (!transformed) return { url: source, alt };
  return {
    url: transformed,
    alt,
    width: 1200,
    height: 630,
    type: "image/jpeg",
  };
}

export const LOGO_SHARE_IMAGE = shareImage(LOGO_URL, "Martha Properties logo", "logo");

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  if (path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function metaDescription(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

type PageSeo = {
  title: string;
  description: string;
  path: string;
  image?: ShareImage;
  type?: "website" | "article";
  index?: boolean;
  publishedTime?: string;
  /** Keep the "%s | Martha Properties" pattern for nested pages such as a listing. */
  keepTemplate?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  image = LOGO_SHARE_IMAGE,
  type = "website",
  index = true,
  publishedTime,
  keepTemplate = false,
}: PageSeo): Metadata {
  const canonical = absoluteUrl(path);
  const socialTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
  const branded = `%s | ${SITE.name}`;
  return {
    title: keepTemplate ? { default: title, template: branded } : { absolute: socialTitle },
    description,
    alternates: { canonical },
    robots: index
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
      : { index: false, follow: false },
    openGraph: {
      type,
      locale: "en_KE",
      url: canonical,
      siteName: SITE.name,
      title: socialTitle,
      description,
      images: [image],
      ...(type === "article" && publishedTime ? { publishedTime, authors: ["Martha Jael"] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image.url],
    },
  };
}

function organizationId() {
  return `${SITE_URL}/#organization`;
}

export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["RealEstateAgent", "Organization"],
        "@id": organizationId(),
        name: SITE.name,
        alternateName: ["Realtor Martha", "Martha Jael"],
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: LOGO_URL,
        },
        image: LOGO_SHARE_IMAGE.url,
        description: HOME_DESCRIPTION,
        telephone: "+254732868220",
        founder: {
          "@type": "Person",
          "@id": `${SITE_URL}/#martha-jael`,
          name: "Martha Jael",
          jobTitle: "Real Estate Consultant and Founder",
          image: FOUNDER_IMAGE,
          url: `${SITE_URL}/about`,
          worksFor: { "@id": organizationId() },
        },
        areaServed: [
          { "@type": "Country", name: "Kenya" },
          { "@type": "AdministrativeArea", name: "Kilifi County" },
          { "@type": "City", name: "Nairobi" },
          { "@type": "City", name: "Malindi" },
        ],
        knowsAbout: [
          "Land for sale in Kenya",
          "Residential property",
          "Property investment",
          "Property viewings",
          "Payment plans for land",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+254732868220",
          contactType: "customer service",
          areaServed: "KE",
          availableLanguage: ["English"],
          url: `${SITE_URL}/contact`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE.name,
        url: SITE_URL,
        inLanguage: "en-KE",
        description: HOME_DESCRIPTION,
        publisher: { "@id": organizationId() },
      },
    ],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function availability(status?: LandListing["status"]) {
  if (status === "sold") return "https://schema.org/SoldOut";
  if (status === "reserved") return "https://schema.org/LimitedAvailability";
  return "https://schema.org/InStock";
}

function addressFromLocation(location: string) {
  const parts = location.split(",").map((part) => part.trim()).filter(Boolean);
  return {
    "@type": "PostalAddress",
    addressLocality: parts[0] || location,
    addressRegion: parts[1] || "Kenya",
    addressCountry: "KE",
  };
}

export function listingJsonLd(listing: LandListing) {
  const path = `/for-sale/${listing.slug}`;
  const images = (listing.images?.length ? listing.images : listing.image ? [listing.image] : []).filter(Boolean);
  const description = metaDescription(
    `${listing.title} is ${listing.type.toLowerCase()} for sale in ${listing.location}. Plot size ${listing.plotSize}. Price ${listing.price}. Deposit ${listing.deposit}. ${listing.balanceTerms}. ${listing.overview}`,
    500
  );
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateListing",
        name: listing.title,
        description,
        url: absoluteUrl(path),
        image: images,
        address: addressFromLocation(listing.location),
        offers: {
          "@type": "Offer",
          price: listing.priceKes || undefined,
          priceCurrency: "KES",
          availability: availability(listing.status),
          url: absoluteUrl(path),
          seller: { "@id": organizationId() },
        },
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "For sale", path: "/for-sale" },
        { name: listing.title, path },
      ]),
    ],
  };
}

export function listingsItemList(listings: LandListing[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Properties for sale in Kenya",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: listings.length,
    itemListElement: listings.map((listing, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: listing.title,
      url: absoluteUrl(`/for-sale/${listing.slug}`),
      image: listing.image || undefined,
      description: `${listing.type} in ${listing.location}. ${listing.plotSize}. ${listing.price}.`,
    })),
  };
}

function articleDate(value: string) {
  const date = new Date(value.includes("T") ? value : `${value}T12:00:00+03:00`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function blogJsonLd(post: BlogPost) {
  const path = `/blogs/${post.slug}`;
  const published = articleDate(post.date);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        articleBody: post.body,
        datePublished: published,
        dateModified: published,
        inLanguage: "en-KE",
        mainEntityOfPage: absoluteUrl(path),
        url: absoluteUrl(path),
        image: LOGO_SHARE_IMAGE.url,
        author: { "@id": `${SITE_URL}/#martha-jael` },
        publisher: { "@id": organizationId() },
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blogs", path: "/blogs" },
        { name: post.title, path },
      ]),
    ],
  };
}

export function blogsItemList(posts: BlogPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Martha Properties articles",
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: absoluteUrl(`/blogs/${post.slug}`),
      description: post.excerpt,
    })),
  };
}
