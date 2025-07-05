// /app/(routes)/study/page.tsx
"use client";

import Countries from "@/components/Countries";
import { touristPlaces } from "@/lib/data/countries";

export default function NationalTourismPage() {
  return (
    <div className="container mx-auto py-8">
      <Countries touristPlaces={touristPlaces} category="national-tourism" />
    </div>
  );
}
