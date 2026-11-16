/**
 * Kilifi land listings — shared by homepage, /for-sale, and /for-sale/[slug].
 * Replace `overview` and `additionalSections` when you have final copy for each property.
 */
export type LandListing = {
  id: number;
  slug: string;
  title: string;
  type: string;
  location: string;
  /** Listing price in KES (for search / filters) */
  priceKes: number;
  image: string;
  /** Extra photos, including the cover. The first item is the cover. */
  images?: string[];
  /** e.g. "50 × 100 ft" */
  plotSize: string;
  price: string;
  deposit: string;
  /** How the balance is paid after deposit */
  balanceTerms: string;
  /** Main intro — edit per property */
  overview: string;
  /** Extra blocks for the detail page — edit headings & body when ready */
  additionalSections: { title: string; body: string }[];
  status?: "available" | "reserved" | "sold";
};

export const LAND_LISTINGS: LandListing[] = [
  {
    id: 1,
    slug: "mtondia-highway-gardens",
    title: "Mtondia Highway Gardens",
    type: "Land",
    location: "Mtondia, Kilifi",
    priceKes: 950_000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773648044/Mtondia_Highway_Gardens_2_lqfmi1.jpg",
    plotSize: "50 × 100 ft",
    price: "KES 950,000",
    deposit: "KES 400,000",
    balanceTerms: "Balance payable in 12 monthly installments",
    overview: `Mtondia Highway Gardens offers premium residential and commercial serviced plots in the fast-growing Mtondia area, strategically positioned to touch the Kilifi-Malindi Highway. This development combines accessibility, security, and growth potential in one of Kilifi County's most promising locations.

The project is perfectly suited for various development purposes including commercial apartments, holiday homes, cottages, and student hostels, making it an ideal investment for both residential and commercial developers.

With essential utilities already on site and a cosmopolitan population, this location offers excellent potential for high returns.`,
    additionalSections: [],
  },
  {
    id: 2,
    slug: "msabaha-phase-6",
    title: "Msabaha Phase 6",
    type: "Land",
    location: "Kizingo, Malindi",
    priceKes: 1_030_000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773648241/Msabaha_Phase_6_lo7mb3.jpg",
    plotSize: "100 × 100 ft",
    price: "KES 1,030,000",
    deposit: "KES 500,000",
    balanceTerms: "Balance payable in 12 monthly installments",
    overview: `Msabaha Phase 6 is strategically located in Malindi, Kizingo area, one of the fastest growing areas in Kilifi County. This premium development offers exceptional accessibility and growth potential for discerning buyers seeking strategic investments in the coastal region.

The project is perfectly positioned for immediate development and settlement, making it ideal for holiday homes, cottages, and residential development.

With essential infrastructure already in place, including water and electricity, this development is ready for immediate use.`,
    additionalSections: [],
  },
  {
    id: 3,
    slug: "bofa-phase-21",
    title: "Bofa Phase 21",
    type: "Land",
    location: "Bofa, Kilifi",
    priceKes: 1_695_000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773648240/Bofa_Phase_21_xx314u.jpg",
    plotSize: "50 × 100 ft",
    price: "KES 1,695,000",
    deposit: "KES 700,000",
    balanceTerms: "Balance payable in 12 monthly installments",
    overview: `Bofa Phase 21 offers premium development plots located off the newly tarmacked Bofa Road (B69), providing excellent accessibility and modern infrastructure. This development combines the convenience of urban living with the tranquility of a well-planned residential area, making it perfect for both residential development and investment opportunities.

The project features complete infrastructure including water and electricity connections, well-demarcated plots with beacons, access roads, and perimeter fencing.

With flexible payment terms and immediate development potential, this location offers exceptional value for money in one of Kilifi County's most accessible and well-developed areas.`,
    additionalSections: [],
  },
  {
    id: 4,
    slug: "tezo-10",
    title: "Rafiki @10",
    type: "Land",
    location: "Near Tezo Town, Kilifi",
    priceKes: 650_000,
    image:
      "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773648243/Tezo_10_rtfk8u.jpg",
    plotSize: "50 × 100 ft",
    price: "KES 650,000",
    deposit: "KES 250,000",
    balanceTerms: "Balance payable in 12 monthly installments",
    overview: `Rafiki @10 is strategically located off the Kilifi–Malindi Highway, just 500m from Tezo Town, in a fast-growing and well-developed area.

The project features a perimeter fence with a common gated entrance, graded access and internal all-weather murram roads, and reliable water availability.

It is close to schools, hospitals, and markets — ideal for immediate residential use or investment (uncontrolled development — build at your own pace).

A 10-acre property subdivided into 72 units.`,
    additionalSections: [
      {
        title: "Valentine + Inuka @10 combo offer",
        body: `Valentine + Inuka @10 Combo Offer valid until end of February:

• Pay 50% (KES 325,000) → Get 10% (KES 65,000) off invoice price (KES 585,000)

• Pay KES 200,000 → Get 5% (KES 32,500) off invoice price (KES 617,500)`,
      },
    ],
  },
];

export function getLandListingBySlug(slug: string): LandListing | undefined {
  return LAND_LISTINGS.find((l) => l.slug === slug);
}
