"use client";

import { useParams } from "next/navigation";
import ListingForm from "../ListingForm";

export default function EditListingPage() {
  const params = useParams<{ id: string }>();
  const listingId = Number(params.id);
  return <ListingForm listingId={Number.isFinite(listingId) ? listingId : undefined} />;
}
