-- Extra photos for each listing. Run this if schema.sql was already applied.

ALTER TABLE listings ADD COLUMN IF NOT EXISTS gallery JSONB NOT NULL DEFAULT '[]';

UPDATE listings
SET gallery = jsonb_build_array(image)
WHERE COALESCE(image, '') <> ''
  AND (gallery IS NULL OR gallery = '[]'::jsonb);
