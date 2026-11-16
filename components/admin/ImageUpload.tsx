"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { uploadListingImage } from "@/lib/supabase/storage";
import { cn } from "@/lib/admin/utils";

type ImageUploadProps = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
};

export default function ImageUpload({
  label = "Cover image",
  value,
  onChange,
  hint,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const url = await uploadListingImage(file);
      onChange(url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-primary">{label}</p>}

      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-primary/15">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-48 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-primary/80 p-1.5 text-white hover:bg-primary"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 px-4 py-4 text-sm font-medium text-primary/70 transition hover:border-accent hover:bg-accent-blend/30",
          uploading && "opacity-60"
        )}
      >
        {uploading ? <Loader2 size={18} className="animate-spin text-accent" /> : <Upload size={18} className="text-accent" />}
        {uploading ? "Uploading…" : value ? "Replace with a photo from this device" : "Upload a photo from this device"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
          event.target.value = "";
        }}
      />

      <input
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Or paste an image URL"
        className="w-full rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-sm text-primary outline-none placeholder:text-primary/40 focus:border-accent focus:ring-2 focus:ring-accent-blend"
      />

      {hint && !error && <p className="text-xs text-primary/50">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
