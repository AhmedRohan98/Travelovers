// /app/global-tourism/page.tsx
"use client";

import Countries from "@/components/Countries";
import { globalTourismCountries } from "@/lib/data/countries";

export default function GlobalTourismPage() {
  return (
    <div className="container mx-auto py-8">
      <Countries countries={globalTourismCountries} category="global-tourism" />
    </div>
  );
}
