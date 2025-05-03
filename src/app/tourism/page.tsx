// /app/(routes)/study/page.tsx
"use client";

import Countries from "@/components/Countries";
import { tourismCountries } from "@/lib/data/countries";

export default function StudyPage() {
  return (
    <div className="container mx-auto py-8">
      <Countries countries={tourismCountries} category="tourism" />
    </div>
  );
}
