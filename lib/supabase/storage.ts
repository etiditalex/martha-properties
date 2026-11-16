/**
 * Upload listing images to the public Supabase Storage bucket `listing-images`.
 */
import { createClient } from "@/lib/supabase/client";

const BUCKET = "listing-images";

export async function uploadListingImage(file: File): Promise<string> {
  const supabase = createClient();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `listings/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
