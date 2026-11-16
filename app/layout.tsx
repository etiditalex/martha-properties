import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/ConditionalLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Realtor Martha | Real Estate in Kenya",
  description:
    "Professional real estate services in Kenya. Residential sales, rentals, property management, and investment consultancy. Start your story here.",
  keywords: ["real estate Kenya", "property Nairobi", "Realtor Martha", "property management"],
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
    <html lang="en" className={`${inter.variable} h-full overflow-x-clip`}>
      <body className="min-h-screen flex flex-col overflow-x-clip antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
