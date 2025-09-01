// /app/global-tourism/page.tsx
"use client";

import { useEffect, useState } from "react";
import Countries, { Country } from "@/components/Countries";
import { getGlobalTourismCountries } from "@/lib/data/countries";

export default function GlobalTourismPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalTourismData = async () => {
      try {
        const data = await getGlobalTourismCountries();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching global tourism data:", error);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalTourismData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4">Loading global tourism destinations...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Countries countries={countries} category="global-tourism" />
    </div>
  );
}
