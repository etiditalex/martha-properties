-- Martha Properties — Supabase schema
-- Run this once in the Supabase SQL editor for a new project.
-- Then sign in at /admin and use "Import from website" to load the current listings, blogs, and reviews.

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS listings (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Land',
  location TEXT NOT NULL,
  price_kes NUMERIC NOT NULL DEFAULT 0,
  image TEXT NOT NULL DEFAULT '',
  plot_size TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  deposit TEXT NOT NULL DEFAULT '',
  balance_terms TEXT NOT NULL DEFAULT '',
  overview TEXT NOT NULL DEFAULT '',
  additional_sections JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  text TEXT NOT NULL,
  relative_time TEXT,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  listing_slug TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  property_name TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'confirmed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_profiles_updated ON profiles;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_listings_updated ON listings;
CREATE TRIGGER trg_listings_updated BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_blogs_updated ON blog_posts;
CREATE TRIGGER trg_blogs_updated BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_reviews_updated ON reviews;
CREATE TRIGGER trg_reviews_updated BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_inquiries_updated ON inquiries;
CREATE TRIGGER trg_inquiries_updated BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_bookings_updated ON bookings;
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_settings_updated ON site_settings;
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published listings" ON listings;
CREATE POLICY "Public read published listings" ON listings
  FOR SELECT USING (published = TRUE);

DROP POLICY IF EXISTS "Public read published blogs" ON blog_posts;
CREATE POLICY "Public read published blogs" ON blog_posts
  FOR SELECT USING (published = TRUE);

DROP POLICY IF EXISTS "Public read published reviews" ON reviews;
CREATE POLICY "Public read published reviews" ON reviews
  FOR SELECT USING (published = TRUE);

DROP POLICY IF EXISTS "Public insert inquiries" ON inquiries;
CREATE POLICY "Public insert inquiries" ON inquiries
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Public insert bookings" ON bookings;
CREATE POLICY "Public insert bookings" ON bookings
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Public read contact settings" ON site_settings;
CREATE POLICY "Public read contact settings" ON site_settings
  FOR SELECT USING (key = 'contact');

DROP POLICY IF EXISTS "Users read own profile" ON profiles;
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin full access profiles" ON profiles;
CREATE POLICY "Admin full access profiles" ON profiles
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access listings" ON listings;
CREATE POLICY "Admin full access listings" ON listings
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access blogs" ON blog_posts;
CREATE POLICY "Admin full access blogs" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access reviews" ON reviews;
CREATE POLICY "Admin full access reviews" ON reviews
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access inquiries" ON inquiries;
CREATE POLICY "Admin full access inquiries" ON inquiries
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access bookings" ON bookings;
CREATE POLICY "Admin full access bookings" ON bookings
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access settings" ON site_settings;
CREATE POLICY "Admin full access settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

GRANT SELECT, INSERT, UPDATE, DELETE ON profiles, listings, blog_posts, reviews, inquiries, bookings, site_settings TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

INSERT INTO site_settings (key, value)
VALUES (
  'contact',
  '{"phone":"+254 732 868220","phoneHref":"tel:+254732868220","website":"https://www.marthapropertiesco.ke","websiteLabel":"www.marthapropertiesco.ke","email":""}'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Listing photos uploaded from the admin dashboard
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-images',
  'listing-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read listing images" ON storage.objects;
CREATE POLICY "Public read listing images"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-images');

DROP POLICY IF EXISTS "Admin upload listing images" ON storage.objects;
CREATE POLICY "Admin upload listing images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'listing-images'
  AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Admin update listing images" ON storage.objects;
CREATE POLICY "Admin update listing images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'listing-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete listing images" ON storage.objects;
CREATE POLICY "Admin delete listing images"
ON storage.objects FOR DELETE
USING (bucket_id = 'listing-images' AND auth.role() = 'authenticated');
