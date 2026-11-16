-- Listing photo uploads for the Martha Properties admin.
-- Run this in the Supabase SQL editor if schema.sql was already applied.

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
