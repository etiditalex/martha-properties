"use client";

import { useEffect, useState } from "react";
import { LAND_LISTINGS, type LandListing } from "@/lib/listings";

export function useLiveListings() {
  const [listings, setListings] = useState<LandListing[]>(LAND_LISTINGS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/listings")
      .then((response) => response.json())
      .then((data: { source?: string; listings?: LandListing[] }) => {
        if (!cancelled && data.source === "database" && Array.isArray(data.listings)) {
          setListings(data.listings);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return listings;
}
