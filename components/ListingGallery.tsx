"use client";

import { useState } from "react";
import Image from "next/image";

type ListingGalleryProps = {
  title: string;
  images: string[];
};

export default function ListingGallery({ title, images }: ListingGalleryProps) {
  const [active, setActive] = useState(0);
  const photos = images.filter(Boolean).slice(0, 10);
  const current = photos[active] || photos[0];
  if (!current) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-martha-sand">
        <Image
          src={current}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />
      </div>
      {photos.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {photos.map((photo, index) => (
            <button
              key={`${photo}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`relative aspect-[4/3] overflow-hidden rounded-md bg-martha-sand ring-2 ring-offset-2 ring-offset-martha-cream ${
                index === active ? "ring-martha-warm" : "ring-transparent"
              }`}
              aria-label={`Show photo ${index + 1}`}
            >
              <Image src={photo} alt="" fill className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
