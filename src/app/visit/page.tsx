"use client";

import Countries from "@/components/Countries";
import { visitCountries } from "@/lib/data/countries";

export default function StudyPage() {
  return (
    <div className="container mx-auto py-8">
      <Countries countries={visitCountries} category="visit" />
    </div>
  );
}
