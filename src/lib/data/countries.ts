import { Country } from "@/components/Countries";

export const studyCountries: Country[] = [
  {
    name: "UK",
    flag: "/assets/countries/study/flags/uk.png",
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

// You can also have separate arrays for other categories
export const tourismCountries: Country[] = [
  { name: "Japan", flag: "/flags/japan.png", continent: "Asia" },
  { name: "France", flag: "/flags/france.png", continent: "Europe" },
  { name: "Italy", flag: "/flags/italy.png", continent: "Europe" },
  { name: "Thailand", flag: "/flags/thailand.png", continent: "Asia" },
  { name: "Spain", flag: "/flags/spain.png", continent: "Europe" },
  { name: "Greece", flag: "/flags/greece.png", continent: "Europe" },
  // Add more tourism countries as needed
];

export const globalTourismCountries: Country[] = [
  // Add global tourism countries here
  { name: "Bali", flag: "/flags/indonesia.png", continent: "Asia" },
  { name: "Maldives", flag: "/flags/maldives.png", continent: "Asia" },
  { name: "Brazil", flag: "/flags/brazil.png", continent: "South America" },
  {
    name: "South Africa",
    flag: "/flags/south-africa.png",
    continent: "Africa",
  },
  { name: "Egypt", flag: "/flags/egypt.png", continent: "Africa" },
  { name: "Mexico", flag: "/flags/mexico.png", continent: "North America" },
  // Add more global tourism destinations as needed
];

// Function to get countries based on category
export function getCountriesByCategory(category: string): Country[] {
  switch (category) {
    case "study":
      return studyCountries;
    case "tourism":
      return tourismCountries;
    case "global-tourism":
      return globalTourismCountries;
    default:
      return studyCountries; // Default to study countries
  }
}
