export type ListingStatus = "available" | "reserved" | "sold";
export type InquiryStatus = "new" | "read" | "responded" | "archived";
export type BookingStatus = "new" | "contacted" | "confirmed" | "cancelled";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
};

export type ListingRow = {
  id: number;
  slug: string;
  title: string;
  type: string;
  location: string;
  price_kes: number;
  image: string;
  gallery: string[];
  plot_size: string;
  price: string;
  deposit: string;
  balance_terms: string;
  overview: string;
  additional_sections: { title: string; body: string }[];
  status: ListingStatus;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  published_at: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  listing_slug: string | null;
  status: InquiryStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferred_date: string | null;
  preferred_time: string | null;
  property_name: string | null;
  message: string | null;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ReviewRow = {
  id: string;
  author: string;
  rating: number;
  text: string;
  relative_time: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
};

export type DashboardStats = {
  listings: number;
  availableListings: number;
  blogs: number;
  newInquiries: number;
  newBookings: number;
};
