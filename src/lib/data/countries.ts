import { Country, TouristPlace } from "@/components/Countries";
import { supabase } from "@/lib/supabase/server";

// Static studyCountries array removed - now using dynamic data from study_country table

// Async function to fetch study countries from Supabase
export async function getStudyCountries(): Promise<Country[]> {
  try {
    const { data, error } = await supabase
      .from('study_country')
      .select('name, flag, continent');

    if (error) {
      console.error('Error fetching study countries data:', error);
      return [];
    }

    // Transform the data to match the Country interface
    return data.map((item: { name: string; flag: string; continent: string }) => ({
      name: item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase(),
      flag: item.flag,
      continent: item.continent,
    }));
  } catch (error) {
    console.error('Error in getStudyCountries:', error);
    return [];
  }
}

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
    return data.map((item: { name: string; flags: string; continent: string; disclaimer?: string }) => ({
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

// Function to get related countries by continent (excluding current country) with randomization
export async function getRelatedVisitCountries(currentCountryName: string, continent: string, limit: number = 5): Promise<Country[]> {
  try {
    const { data, error } = await supabase
      .from('visa_country')
      .select('name, flags, continent')
      .eq('continent', continent)
      .neq('name', currentCountryName.toLowerCase());

    if (error) {
      console.error('Error fetching related visit countries:', error);
      return [];
    }

    // Shuffle the array to get random results
    const shuffled = data.sort(() => 0.5 - Math.random());
    const limited = shuffled.slice(0, limit);

    return limited.map((item: { name: string; flags: string; continent: string }) => ({
      name: item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase(),
      flag: item.flags,
      continent: item.continent,
    }));
  } catch (error) {
    console.error('Error in getRelatedVisitCountries:', error);
    return [];
  }
}

// Function to get related study countries by continent (excluding current country) with randomization
export async function getRelatedStudyCountries(currentCountryName: string, continent: string, limit: number = 5): Promise<Country[]> {
  try {
    const { data, error } = await supabase
      .from('study_country')
      .select('name, flag, continent')
      .eq('continent', continent)
      .neq('name', currentCountryName.toLowerCase());

    if (error) {
      console.error('Error fetching related study countries:', error);
      return [];
    }

    // Shuffle the array to get random results
    const shuffled = data.sort(() => 0.5 - Math.random());
    const limited = shuffled.slice(0, limit);

    return limited.map((item: { name: string; flag: string; continent: string }) => ({
      name: item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase(),
      flag: item.flag,
      continent: item.continent,
    }));
  } catch (error) {
    console.error('Error in getRelatedStudyCountries:', error);
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
    return data.map((item: { destination: string; flag: string; continent: string }) => ({
      name: item.destination.charAt(0).toUpperCase() + item.destination.slice(1).toLowerCase(),
      flag: item.flag,
      continent: item.continent,
    }));
  } catch (error) {
    console.error('Error in getGlobalTourismCountries:', error);
    return [];
  }
}

// Function to get related global tourism countries by continent (excluding current country) with randomization
export async function getRelatedGlobalTourismCountries(currentCountryName: string, continent: string, limit: number = 5): Promise<Country[]> {
  try {
    const { data, error } = await supabase
      .from('international_tourism')
      .select('destination, flag, continent')
      .eq('continent', continent)
      .neq('destination', currentCountryName.toLowerCase());

    if (error) {
      console.error('Error fetching related global tourism countries:', error);
      return [];
    }

    // Shuffle the array to get random results
    const shuffled = data.sort(() => 0.5 - Math.random());
    const limited = shuffled.slice(0, limit);

    return limited.map((item: { destination: string; flag: string; continent: string }) => ({
      name: item.destination.charAt(0).toUpperCase() + item.destination.slice(1).toLowerCase(),
      flag: item.flag,
      continent: item.continent,
    }));
  } catch (error) {
    console.error('Error in getRelatedGlobalTourismCountries:', error);
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
      // For study, use the async function getStudyCountries()
      throw new Error("Use getStudyCountries() for study category");
    case "visit":
      // For visit, use the async function getVisitCountries()
      throw new Error("Use getVisitCountries() for visit category");
    case "national-tourism":
      return touristPlaces;
    case "global-tourism":
      // For global-tourism, use the async function getGlobalTourismCountries()
      throw new Error("Use getGlobalTourismCountries() for global-tourism category");
    default:
      throw new Error("Use getStudyCountries() for study category");
  }
}

// Async function to get countries based on category (for visit and global-tourism)
export async function getCountriesByCategoryAsync(
  category: string
): Promise<Country[] | TouristPlace[]> {
  switch (category) {
    case "study":
      return await getStudyCountries();
    case "visit":
      return await getVisitCountries();
    case "national-tourism":
      return touristPlaces;
    case "global-tourism":
      return await getGlobalTourismCountries();
    default:
      return await getStudyCountries();
  }
}
