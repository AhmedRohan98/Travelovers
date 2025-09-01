import { Country, TouristPlace } from "@/components/Countries";
import { supabase } from "@/lib/supabase/server";

export const studyCountries: Country[] = [
  {
    name: "United-Kingdom",
    flag: "/assets/countries/study/flags/united_kingdom.png",
    continent: "Europe",
  },
  {
    name: "USA",
    flag: "/assets/countries/study/flags/usa.png",
    continent: "North America",
  },
  {
    name: "Canada",
    flag: "/assets/countries/study/flags/canada.png",
    continent: "North America",
  },
  {
    name: "Australia",
    flag: "/assets/countries/study/flags/australia.png",
    continent: "Australia",
  },
  {
    name: "Cyprus",
    flag: "/assets/countries/study/flags/cyprus.png",
    continent: "Europe",
  },
  {
    name: "Germany",
    flag: "/assets/countries/study/flags/germany.png",
    continent: "Europe",
  },
  {
    name: "Italy",
    flag: "/assets/countries/study/flags/italy.png",
    continent: "Europe",
  },
  {
    name: "Belgium",
    flag: "/assets/countries/study/flags/belgium.png",
    continent: "Europe",
  },
  {
    name: "France",
    flag: "/assets/countries/study/flags/france.png",
    continent: "Europe",
  },
  {
    name: "Hungary",
    flag: "/assets/countries/study/flags/hungary.png",
    continent: "Europe",
  },
  {
    name: "Austria",
    flag: "/assets/countries/study/flags/austria.png",
    continent: "Europe",
  },
];

// Static visitCountries array removed - now using dynamic data from visit_country table

// Async function to fetch visit countries from Supabase
export async function getVisitCountries(): Promise<Country[]> {
  try {
    const { data, error } = await supabase
      .from('visa_country')
      .select('name, flags, continent, disclaimer');

    if (error) {
      console.error('Error fetching visit countries data:', error);
      return [];
    }

    // Transform the data to match the Country interface
    return data.map((item: any) => ({
      name: item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase(),
      flag: item.flags,
      continent: item.continent,
      disclaimer: item.disclaimer,
    }));
  } catch (error) {
    console.error('Error in getVisitCountries:', error);
    return [];
  }
}

// Function to get related countries by continent (excluding current country)
export async function getRelatedVisitCountries(currentCountryName: string, continent: string, limit: number = 5): Promise<Country[]> {
  try {
    const { data, error } = await supabase
      .from('visa_country')
      .select('name, flags, continent')
      .eq('continent', continent)
      .neq('name', currentCountryName.toLowerCase())
      .limit(limit);

    if (error) {
      console.error('Error fetching related visit countries:', error);
      return [];
    }

    return data.map((item: any) => ({
      name: item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase(),
      flag: item.flags,
      continent: item.continent,
    }));
  } catch (error) {
    console.error('Error in getRelatedVisitCountries:', error);
    return [];
  }
}

export async function getGlobalTourismCountries(): Promise<Country[]> {
  try {
    const { data, error } = await supabase
      .from('international_tourism')
      .select('destination, flag, continent');

    if (error) {
      console.error('Error fetching global tourism data:', error);
      return [];
    }

    // Transform the data to match the Country interface
    return data.map((item: any) => ({
      name: item.destination.charAt(0).toUpperCase() + item.destination.slice(1).toLowerCase(),
      flag: item.flag,
      continent: item.continent,
    }));
  } catch (error) {
    console.error('Error in getGlobalTourismCountries:', error);
    return [];
  }
}

export const touristPlaces: TouristPlace[] = [
  {
    name: "Hunza",
    imageUrl: "/assets/places/hunza.jpg",
    region: "Gilgit-Baltistan",
  },
  {
    name: "Naran",
    imageUrl: "/assets/places/naran.jpg",
    region: "Khyber Pakhtunkhwa",
  },
  {
    name: "Gilgit",
    imageUrl: "/assets/places/gilgit.jpg",
    region: "Gilgit-Baltistan",
  },
  {
    name: "Skardu",
    imageUrl: "/assets/places/skardu.jpg",
    region: "Gilgit-Baltistan",
  },
  {
    name: "Kumrat",
    imageUrl: "/assets/places/kumrat.jpg",
    region: "Khyber Pakhtunkhwa",
  },
  {
    name: "Shogran",
    imageUrl: "/assets/places/shogran.jpg",
    region: "Khyber Pakhtunkhwa",
  },
  {
    name: "Swat-Valley",
    imageUrl: "/assets/places/swat-valley.jpg",
    region: "Khyber Pakhtunkhwa",
  },
  {
    name: "Neelum-Valley",
    imageUrl: "/assets/places/neelum-valley.jpg",
    region: "Azad Kashmir",
  },
  {
    name: "Fairy-Meadow",
    imageUrl: "/assets/places/fairy-meadow.jpg",
    region: "Gilgit-Baltistan",
  },
];

// Function to get countries based on category (sync for static data)
export function getCountriesByCategory(
  category: string
): Country[] | TouristPlace[] {
  switch (category) {
    case "study":
      return studyCountries;
    case "visit":
      // For visit, use the async function getVisitCountries()
      throw new Error("Use getVisitCountries() for visit category");
    case "national-tourism":
      return touristPlaces;
    case "global-tourism":
      // For global-tourism, use the async function getGlobalTourismCountries()
      throw new Error("Use getGlobalTourismCountries() for global-tourism category");
    default:
      return studyCountries;
  }
}

// Async function to get countries based on category (for visit and global-tourism)
export async function getCountriesByCategoryAsync(
  category: string
): Promise<Country[] | TouristPlace[]> {
  switch (category) {
    case "study":
      return studyCountries;
    case "visit":
      return await getVisitCountries();
    case "national-tourism":
      return touristPlaces;
    case "global-tourism":
      return await getGlobalTourismCountries();
    default:
      return studyCountries;
  }
}
