import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { JsonLd } from "@/components/JsonLd";
import { LOGO_URL } from "@/lib/site";
import { HOME_DESCRIPTION, HOME_TITLE, LOGO_SHARE_IMAGE, SITE_URL, siteGraph } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: "%s | Martha Properties",
  },
  description: HOME_DESCRIPTION,
  applicationName: "Martha Properties",
  authors: [{ name: "Martha Jael", url: `${SITE_URL}/about` }],
  creator: "Martha Jael",
  publisher: "Martha Properties",
  category: "Real Estate",
  keywords: [
    "Martha Properties",
    "Realtor Martha",
    "Martha Jael",
    "real estate Kenya",
    "land for sale Kilifi",
    "land for sale Malindi",
    "property for sale Kenya",
    "plots for sale Kenya",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE_URL,
    siteName: "Martha Properties",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [LOGO_SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [LOGO_SHARE_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: LOGO_URL, type: "image/png" },
    ],
    apple: [{ url: LOGO_URL, type: "image/png" }],
    shortcut: LOGO_URL,
  },
};

/** Mobile-first: correct scaling, theme for browser chrome, user zoom allowed */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f6f3",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-KE" className={`${inter.variable} h-full overflow-x-clip`}>
      <body className="min-h-screen flex flex-col overflow-x-clip antialiased">
        <JsonLd data={siteGraph()} />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
