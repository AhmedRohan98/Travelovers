import { Country, TouristPlace } from "@/components/Countries";
import { supabase } from "@/lib/supabase/server";

// Static studyCountries array removed - now using dynamic data from study_country table

// Fallback study countries data
const fallbackStudyCountries: Country[] = [
  { name: "United Kingdom", flag: "/assets/countries/study/flags/united_kingdom.png", continent: "Europe" },
  { name: "Cyprus", flag: "/assets/countries/study/flags/cyprus.png", continent: "Europe" },
  { name: "Australia", flag: "/assets/countries/study/flags/australia.png", continent: "Oceania" },
  { name: "Italy", flag: "/assets/countries/study/flags/italy.png", continent: "Europe" },
  { name: "France", flag: "/assets/countries/study/flags/france.png", continent: "Europe" },
  { name: "USA", flag: "/assets/countries/study/flags/usa.png", continent: "North America" },
  { name: "Germany", flag: "/assets/countries/study/flags/germany.png", continent: "Europe" },
  { name: "Austria", flag: "/assets/countries/study/flags/austria.png", continent: "Europe" },
  { name: "Belgium", flag: "/assets/countries/study/flags/belgium.png", continent: "Europe" },
  { name: "Canada", flag: "/assets/countries/study/flags/canada.png", continent: "North America" },
  { name: "Hungary", flag: "/assets/countries/study/flags/hungary.png", continent: "Europe" },
];

// Async function to fetch study countries from Supabase
export async function getStudyCountries(): Promise<Country[]> {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, using fallback data for study countries');
      return fallbackStudyCountries;
    }

    const { data, error } = await supabase
      .from('study_country')
      .select('name, flag, continent');

    if (error) {
      console.error('Error fetching study countries data:', error);
      return fallbackStudyCountries;
    }

    if (!data || data.length === 0) {
      return fallbackStudyCountries;
    }

    // Transform the data to match the Country interface
    return data.map((item: { name: string; flag: string; continent: string }) => ({
      name: item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase(),
      flag: item.flag,
      continent: item.continent,
    }));
  } catch (error) {
    console.error('Error in getStudyCountries:', error);
    return fallbackStudyCountries;
  }
}

// Fallback visit countries data
const fallbackVisitCountries: Country[] = [
  { name: "Albania", flag: "/assets/countries/visit/flags/albania.png", continent: "Europe" },
  { name: "Australia", flag: "/assets/countries/visit/flags/australia.png", continent: "Oceania" },
  { name: "Austria", flag: "/assets/countries/visit/flags/austria.png", continent: "Europe" },
  { name: "Azerbaijan", flag: "/assets/countries/visit/flags/azerbaijan.png", continent: "Asia" },
  { name: "Belgium", flag: "/assets/countries/visit/flags/belgium.png", continent: "Europe" },
  { name: "Bulgaria", flag: "/assets/countries/visit/flags/bulgaria.png", continent: "Europe" },
  { name: "Cambodia", flag: "/assets/countries/visit/flags/cambodia.png", continent: "Asia" },
  { name: "Canada", flag: "/assets/countries/visit/flags/canada.png", continent: "North America" },
  { name: "China", flag: "/assets/countries/visit/flags/china.png", continent: "Asia" },
  { name: "Croatia", flag: "/assets/countries/visit/flags/croatia.png", continent: "Europe" },
  { name: "Cyprus", flag: "/assets/countries/visit/flags/cyprus.png", continent: "Europe" },
  { name: "Czech Republic", flag: "/assets/countries/visit/flags/czech_republic.png", continent: "Europe" },
  { name: "Denmark", flag: "/assets/countries/visit/flags/denmark.png", continent: "Europe" },
  { name: "Egypt", flag: "/assets/countries/visit/flags/egypt.png", continent: "Africa" },
  { name: "Estonia", flag: "/assets/countries/visit/flags/estonia.png", continent: "Europe" },
  { name: "Finland", flag: "/assets/countries/visit/flags/finland.png", continent: "Europe" },
  { name: "France", flag: "/assets/countries/visit/flags/france.png", continent: "Europe" },
  { name: "Georgia", flag: "/assets/countries/visit/flags/georgia.png", continent: "Asia" },
  { name: "Germany", flag: "/assets/countries/visit/flags/germany.png", continent: "Europe" },
  { name: "Greece", flag: "/assets/countries/visit/flags/greece.png", continent: "Europe" },
  { name: "Hong Kong", flag: "/assets/countries/visit/flags/hong_kong.png", continent: "Asia" },
  { name: "Hungary", flag: "/assets/countries/visit/flags/hungary.png", continent: "Europe" },
  { name: "Iceland", flag: "/assets/countries/visit/flags/iceland.png", continent: "Europe" },
  { name: "Indonesia", flag: "/assets/countries/visit/flags/indonesia.png", continent: "Asia" },
  { name: "Ireland", flag: "/assets/countries/visit/flags/ireland.png", continent: "Europe" },
  { name: "Italy", flag: "/assets/countries/visit/flags/italy.png", continent: "Europe" },
  { name: "Japan", flag: "/assets/countries/visit/flags/japan.png", continent: "Asia" },
  { name: "Latvia", flag: "/assets/countries/visit/flags/latvia.png", continent: "Europe" },
  { name: "Lithuania", flag: "/assets/countries/visit/flags/lithuania.png", continent: "Europe" },
  { name: "Luxembourg", flag: "/assets/countries/visit/flags/luxembourg.png", continent: "Europe" },
  { name: "Malaysia", flag: "/assets/countries/visit/flags/malaysia.png", continent: "Asia" },
  { name: "Malta", flag: "/assets/countries/visit/flags/malta.png", continent: "Europe" },
  { name: "Morocco", flag: "/assets/countries/visit/flags/morocco.png", continent: "Africa" },
  { name: "Netherlands", flag: "/assets/countries/visit/flags/netherlands.png", continent: "Europe" },
  { name: "New Zealand", flag: "/assets/countries/visit/flags/new_zealand.png", continent: "Oceania" },
  { name: "North Cyprus", flag: "/assets/countries/visit/flags/north_cyprus.png", continent: "Europe" },
  { name: "Norway", flag: "/assets/countries/visit/flags/norway.png", continent: "Europe" },
  { name: "Poland", flag: "/assets/countries/visit/flags/poland.png", continent: "Europe" },
  { name: "Portugal", flag: "/assets/countries/visit/flags/portugal.png", continent: "Europe" },
  { name: "Romania", flag: "/assets/countries/visit/flags/romania.png", continent: "Europe" },
  { name: "Russia", flag: "/assets/countries/visit/flags/russia.png", continent: "Europe" },
  { name: "Singapore", flag: "/assets/countries/visit/flags/singapore.png", continent: "Asia" },
  { name: "Slovakia", flag: "/assets/countries/visit/flags/slovakia.png", continent: "Europe" },
  { name: "South Africa", flag: "/assets/countries/visit/flags/south_africa.png", continent: "Africa" },
  { name: "South Korea", flag: "/assets/countries/visit/flags/south_korea.png", continent: "Asia" },
  { name: "Spain", flag: "/assets/countries/visit/flags/spain.png", continent: "Europe" },
  { name: "Sri Lanka", flag: "/assets/countries/visit/flags/sri_lanka.png", continent: "Asia" },
  { name: "Sweden", flag: "/assets/countries/visit/flags/sweden.png", continent: "Europe" },
  { name: "Switzerland", flag: "/assets/countries/visit/flags/switzerland.png", continent: "Europe" },
  { name: "Thailand", flag: "/assets/countries/visit/flags/thailand.png", continent: "Asia" },
  { name: "Turkey", flag: "/assets/countries/visit/flags/turkey.png", continent: "Asia" },
  { name: "UAE", flag: "/assets/countries/visit/flags/uae.png", continent: "Asia" },
  { name: "United Kingdom", flag: "/assets/countries/visit/flags/united_kingdom.png", continent: "Europe" },
  { name: "USA", flag: "/assets/countries/visit/flags/usa.png", continent: "North America" },
];

// Async function to fetch visit countries from Supabase
export async function getVisitCountries(): Promise<Country[]> {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, using fallback data for visit countries');
      return fallbackVisitCountries;
    }

    const { data, error } = await supabase
      .from('visa_country')
      .select('name, flags, continent, disclaimer');

    if (error) {
      console.error('Error fetching visit countries data:', error);
      return fallbackVisitCountries;
    }

    if (!data || data.length === 0) {
      return fallbackVisitCountries;
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
    return fallbackVisitCountries;
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

// Fallback global tourism countries data
const fallbackGlobalTourismCountries: Country[] = [
  { name: "Baku", flag: "/assets/global/baku.jpg", continent: "Asia" },
  { name: "Dubai", flag: "/assets/global/dubai.jpg", continent: "Asia" },
  { name: "Egypt", flag: "/assets/global/egypt.jpg", continent: "Africa" },
  { name: "Malaysia", flag: "/assets/global/malaysia.jpg", continent: "Asia" },
  { name: "Maldives", flag: "/assets/global/maldives.jpg", continent: "Asia" },
  { name: "Singapore", flag: "/assets/global/singapore.jpg", continent: "Asia" },
  { name: "Thailand", flag: "/assets/global/thailand.jpg", continent: "Asia" },
  { name: "Turkey", flag: "/assets/global/turkey.jpg", continent: "Asia" },
];

export async function getGlobalTourismCountries(): Promise<Country[]> {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, using fallback data for global tourism countries');
      return fallbackGlobalTourismCountries;
    }

    const { data, error } = await supabase
      .from('international_tourism')
      .select('destination, flag, continent');

    if (error) {
      console.error('Error fetching global tourism data:', error);
      return fallbackGlobalTourismCountries;
    }

    if (!data || data.length === 0) {
      return fallbackGlobalTourismCountries;
    }

    // Transform the data to match the Country interface
    return data.map((item: { destination: string; flag: string; continent: string }) => ({
      name: item.destination.charAt(0).toUpperCase() + item.destination.slice(1).toLowerCase(),
      flag: item.flag,
      continent: item.continent,
    }));
  } catch (error) {
    console.error('Error in getGlobalTourismCountries:', error);
    return fallbackGlobalTourismCountries;
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
