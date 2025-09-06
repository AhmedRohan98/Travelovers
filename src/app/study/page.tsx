// /app/(routes)/study/page.tsx
"use client";

import { useEffect, useState } from "react";
import Countries from "@/components/Countries";
import { getStudyCountries } from "@/lib/data/countries";
import { Country } from "@/components/Countries";

export default function StudyPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudyCountries = async () => {
      try {
        setLoading(true);
        const data = await getStudyCountries();
        setCountries(data);
      } catch (err) {
        console.error('Error fetching study countries:', err);
        setError('Failed to load study countries');
      } finally {
        setLoading(false);
      }
    };

    fetchStudyCountries();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Countries countries={countries} category="study" />
    </div>
  );
}
