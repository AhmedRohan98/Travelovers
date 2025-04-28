// /app/(routes)/countries/[category]/[country]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { getCountriesByCategory } from "@/lib/data/countries";
import Link from "next/link";

export default function CountryDetailPage() {
  const params = useParams();
  const category = params.category as string;
  const countryName = params.country as string;

  const countries = getCountriesByCategory(category);
  const country = countries.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase()
  );

  if (!country) {
    return <div className="container mx-auto py-8">Country not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Link
        href={`/${category}`}
        className="text-blue-500 hover:underline mb-6 block"
      >
        &larr; Back to {category.replace("-", " ")}
      </Link>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <img src={country.flag} alt={country.name} className="h-12 mr-4" />
          <h1 className="text-3xl font-bold">{country.name}</h1>
        </div>

        <div className="mb-4">
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {country.continent}
          </span>
        </div>

        <h2 className="text-xl font-semibold mb-2">
          {category === "study"
            ? "Study Opportunities in"
            : category === "tourism"
            ? "Tourism Information for"
            : "Global Tourism Insights for"}{" "}
          {country.name}
        </h2>

        <p className="text-gray-700 mb-4">
          This is detailed information about {country.name} specific to the{" "}
          {category.replace("-", " ")} category.
          {/* You would fetch and display real data here based on country and category */}
        </p>

        {/* Additional sections based on category */}
        {category === "study" && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Universities</h3>
            <p className="text-gray-700">
              List of universities in {country.name}...
            </p>
          </div>
        )}

        {(category === "tourism" || category === "global-tourism") && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Popular Attractions</h3>
            <p className="text-gray-700">
              Top tourist destinations in {country.name}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
