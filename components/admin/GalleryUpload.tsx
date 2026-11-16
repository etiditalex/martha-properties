"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { uploadListingImage } from "@/lib/supabase/storage";
import { cn } from "@/lib/admin/utils";

const MAX_IMAGES = 10;

type GalleryUploadProps = {
  label?: string;
  value: string[];
  onChange: (urls: string[]) => void;
};

export default function GalleryUpload({
  label = "Property photos",
  value,
  onChange,
}: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [error, setError] = useState("");
  const remaining = MAX_IMAGES - value.length;

  const addUrls = (urls: string[]) => {
    const next = [...value];
    for (const url of urls) {
      const trimmed = url.trim();
      if (!trimmed || next.includes(trimmed) || next.length >= MAX_IMAGES) continue;
      next.push(trimmed);
    }
    onChange(next);
  };

  const handleFiles = async (files: File[]) => {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (!images.length) {
      setError("Please choose image files.");
      return;
    }
    if (images.some((file) => file.size > 10 * 1024 * 1024)) {
      setError("Each image must be under 10MB.");
      return;
    }
    if (remaining <= 0) {
      setError("A listing can have up to 10 photos.");
      return;
    }

    const selected = images.slice(0, remaining);
    setError("");
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of selected) {
        uploaded.push(await uploadListingImage(file));
      }
      addUrls(uploaded);
      if (images.length > selected.length) {
        setError(`Only ${selected.length} photo${selected.length === 1 ? "" : "s"} were added. The limit is 10.`);
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-primary">{label}</p>
        <p className="text-xs text-primary/50">
          {value.length}/{MAX_IMAGES}
        </p>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url, index) => (
            <div key={`${url}-${index}`} className="relative overflow-hidden rounded-xl border border-primary/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-28 w-full object-cover" />
              <span className="absolute left-2 top-2 rounded-full bg-primary/80 px-2 py-0.5 text-[10px] font-bold text-accent">
                {index === 0 ? "Cover" : index + 1}
              </span>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
                className="absolute right-2 top-2 rounded-full bg-primary/80 p-1 text-white hover:bg-primary"
                aria-label="Remove photo"
              >
                <X size={12} />
              </button>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const next = [...value];
                    const [chosen] = next.splice(index, 1);
                    next.unshift(chosen);
                    onChange(next);
                  }}
                  className="absolute inset-x-2 bottom-2 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-semibold text-primary"
                >
                  Use as cover
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || remaining <= 0}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 px-4 py-4 text-sm font-medium text-primary/70 transition hover:border-accent hover:bg-accent-blend/30 disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {uploading ? <Loader2 size={18} className="animate-spin text-accent" /> : <Upload size={18} className="text-accent" />}
        {uploading ? "Uploading…" : "Choose photos from this device"}
      </button>
      <p className="text-xs text-primary/50">
        Select up to {remaining} more photo{remaining === 1 ? "" : "s"} at once. The first photo is the cover on listing cards.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(event) => {
          const files = Array.from(event.target.files || []);
          if (files.length) handleFiles(files);
          event.target.value = "";
        }}
      />

      <div className="flex gap-2">
        <input
          type="url"
          value={urlDraft}
          onChange={(event) => setUrlDraft(event.target.value)}
          placeholder="Or paste an image URL"
          className="w-full rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-sm text-primary outline-none placeholder:text-primary/40 focus:border-accent focus:ring-2 focus:ring-accent-blend"
        />
        <button
          type="button"
          disabled={!urlDraft.trim() || remaining <= 0}
          onClick={() => {
            addUrls([urlDraft]);
            setUrlDraft("");
          }}
          className="shrink-0 rounded-xl border border-primary/20 px-3 text-sm font-semibold text-primary hover:border-accent disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
