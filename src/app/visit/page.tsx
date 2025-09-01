"use client";

import { useEffect, useState } from "react";
import Countries, { Country } from "@/components/Countries";
import { getVisitCountries } from "@/lib/data/countries";

export default function VisitPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitData = async () => {
      try {
        const data = await getVisitCountries();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching visit countries data:", error);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4">Loading visit countries...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Countries countries={countries} category="visit" />
    </div>
  );
}
