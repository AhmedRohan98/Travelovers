"use client";

import { useParams } from "next/navigation";
import {
  getCountriesByCategory,
  getRelatedVisitCountries,
  getRelatedStudyCountries,
  getRelatedGlobalTourismCountries,
  getVisitCountries,
  getGlobalTourismCountries,
  getStudyCountries,
} from "@/lib/data/countries";
import { Country } from "@/components/Countries";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  Grid2,
  Breadcrumbs,
  Card,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HandshakeIcon from "@mui/icons-material/Handshake";
import DescriptionIcon from "@mui/icons-material/Description";
import FlightIcon from "@mui/icons-material/Flight";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import { Accordion } from "@/components/Accordion";
import { supabase } from "@/lib/supabase/server";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";

interface CountryVisaData {
  id: number;
  name: string;
  overview: string;
  consultancy_charges: string;
  req_docs: string;
  employed: string;
  self_employed: string;
  unemployed: string;
  additional: string;
  terms: string;
  disclaimer?: string;
  key_aspects?: {
    validity?: string;
    entry_type?: string;
    processing_time?: string;
  };
  quick_info?: {
    visa_fee?: string;
    interview?: string;
    application_submission?: string;
  };
  considerations: string;
}

interface CountryStudyData {
  id: number;
  name: string;
  overview: string;
  eligibility_crit: string;
  finances: string;
  terms: string;
  req_adm: string;
  req_visa: string;
  additional: string;
  created_at: string;
  disclaimer?: string;
  key_aspects?: {
    intake?: string;
    language_proficiency?: string;
    post_study_work?: string;
  };
}

export default function CountryDetailPage() {
  const params = useParams();
  const category = params.category as string;
  const countryName = params.country as string;

  const [country, setCountry] = useState<Country | null>(null);
  const [countryData, setCountryData] = useState<
    CountryVisaData | CountryStudyData | null
  >(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [relatedCountries, setRelatedCountries] = useState<Country[]>([]);

  // Fetch countries based on category
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        let countriesData: Country[];
        if (category === "global-tourism") {
          countriesData = await getGlobalTourismCountries();
        } else if (category === "visit") {
          countriesData = await getVisitCountries();
        } else if (category === "study") {
          countriesData = await getStudyCountries();
        } else {
          countriesData = getCountriesByCategory(category) as Country[];
        }
        
        const foundCountry = countriesData.find(
          (c) => c.name.toLowerCase() === countryName.toLowerCase()
        );
        setCountry(foundCountry || null);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountry(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [category, countryName]);

  useEffect(() => {
    if (category === "study" || category === "visit") {
      const fetchCountries = async () => {
        setLoading(true);
        const tableName =
          category === "study" ? "study_country" : "visa_country";
        const dbName = countryName.toLowerCase();
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq("name", dbName)
          .maybeSingle();

        if (error && Object.keys(error).length > 0) {
          setFetchError(
            "Failed to fetch country data. Please try again later."
          );
          setOpenSnackbar(true);
        } else if (!data) {
          setFetchError("No country data found for this selection.");
          setOpenSnackbar(true);
          setCountryData(null);
        } else {
          // Parse JSON fields if they are strings
          const processedData = {
            ...data,
            key_aspects: typeof data.key_aspects === 'string' 
              ? JSON.parse(data.key_aspects) 
              : data.key_aspects,
            quick_info: typeof data.quick_info === 'string' 
              ? JSON.parse(data.quick_info) 
              : data.quick_info,
          };
          setCountryData(processedData);
          setFetchError(null);
          
          // Fetch related countries for visit, study, and global-tourism categories
          if ((category === "visit" || category === "study" || category === "global-tourism") && data.continent) {
            if (category === "visit") {
              const related = await getRelatedVisitCountries(dbName, data.continent, 5);
              setRelatedCountries(related);
            } else if (category === "study") {
              const related = await getRelatedStudyCountries(dbName, data.continent, 5);
              setRelatedCountries(related);
            } else if (category === "global-tourism") {
              const related = await getRelatedGlobalTourismCountries(dbName, data.continent, 5);
              setRelatedCountries(related);
            }
          }
        }
        setLoading(false);
      };

      fetchCountries();
    } else {
      setCountryData(null);
      setLoading(false);
    }
  }, [category, countryName]);

  // Type guard functions
  const isStudyData = (
    data: CountryVisaData | CountryStudyData | null
  ): data is CountryStudyData => {
    return category === "study" && data !== null && "eligibility_crit" in data;
  };

  const isVisaData = (
    data: CountryVisaData | CountryStudyData | null
  ): data is CountryVisaData => {
    return category === "visit" && data !== null && "req_docs" in data;
  };

  // Helper function to format text with bold key phrases
  const formatTextWithBold = (text: string): string => {
    if (!text) return '';
    
    // Split by lines and process each line
    return text.split('\n').map(line => {
      // Skip empty lines
      if (!line.trim()) return line;
      
      // Pattern to match key phrases followed by colon or dash
      const patterns = [
        // For visit category patterns
        /^([^:–]+[:\–])\s*(.*)$/,
        // For study category patterns like "Average Annual Fee in Cyprus:"
        /^([^:]+:)\s*(.*)$/,
      ];
      
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          const [, keyPhrase, description] = match;
          return `<strong style="color: #B90C1C; font-weight: bold;">${keyPhrase.trim()}</strong> ${description.trim()}`;
        }
      }
      
      // If no pattern matches, return the line as is
      return line;
    }).join('<br/>');
  };

  if (!country && loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Header Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2, mb: 3 }} />
          <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
        </Box>

        {/* Content Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="100%" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="90%" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="80%" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="95%" height={30} sx={{ mb: 2 }} />
        </Box>

        {/* Cards Skeleton */}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} variant="rectangular" width="33%" height={200} sx={{ borderRadius: 2 }} />
          ))}
        </Box>

        {/* Additional Content Skeleton */}
        <Box>
          <Skeleton variant="text" width="70%" height={40} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="100%" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="85%" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="90%" height={30} sx={{ mb: 1 }} />
        </Box>
      </Container>
    );
  }

  if (!country && !loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h4" mb={2}>
            Country not found
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            The requested country could not be found.
          </Typography>
          <Link href={`/${category}`}>
            <Typography
              variant="body1"
              sx={{
                color: "#B90C1C",
                textDecoration: "underline",
                "&:hover": { color: "#a00a18" },
              }}
            >
              Back to {category.replace("-", " ")} Countries
            </Typography>
          </Link>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Snackbar for fetch errors */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          sx={{ width: "100%" }}
          onClose={() => setOpenSnackbar(false)}
        >
          {fetchError}
        </Alert>
      </Snackbar>

      {/* Banner/Header */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 450,
          mb: 4,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Lazy loaded background image */}
        <Image
          src={
            category === "national-tourism"
              ? `/assets/places/${countryName}.jpg`
              : `/assets/countries/${category}/place/${countryName}.jpg`
          }
          alt={`${country?.name} Banner`}
          fill
          style={{ objectFit: "cover", zIndex: 0 }}
          loading="lazy"
          priority={false}
        />
        {/* Overlay for darkening */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 1,
            borderRadius: "12px",
          }}
        />
        {/* Overlay Content */}
        <Box
          sx={{
            position: "absolute",
            width: { xs: "90%", sm: "70%", md: "50%" },
            top: "50%",
            left: { xs: "5%", md: "5%" },
            transform: "translateY(-50%)",
            color: "white",
            zIndex: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 2,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Link href={`/${category}`}>
            <ArrowBackIosIcon
              sx={{
                color: "white",
                fontSize: "2rem",
                "&:hover": {
                  color: "#660D17",
                },
                transition: "color 0.3s",
              }}
            />
          </Link>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "2.5rem", md: "3.5rem" },
                  textTransform: "uppercase",
                  fontStyle: "italic",
                  fontWeight: "bold",
                }}
              >
                {country?.name.replace("-", " ")}
              </Typography>
              {category !== "national-tourism" && country && "flag" in country && (
                <Box>
                  <Image
                    src={country.flag}
                    alt={`${country.name} flag`}
                    width={80}
                    height={60}
                    style={{
                      borderRadius: "10%",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                </Box>
              )}
            </Box>
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{
                color: "white",
                "& .MuiBreadcrumbs-separator": { color: "white" },
              }}
            >
              <Link href="/" style={{ color: "white", textDecoration: "none" }}>
                Home
              </Link>
              <Link
                href={`/${category}`}
                style={{ color: "white", textDecoration: "none" }}
              >
                {category.replace("-", " ").toUpperCase()}
              </Link>
              <Typography color="white">
                {country?.name.replace("-", " ")}
              </Typography>
            </Breadcrumbs>
          </Box>
        </Box>
      </Box>

      <Grid2 container spacing={4}>
        {/* Main Content */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          {/* Page Header and Overview */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h2"
              sx={{
                color: "#B90C1C",
                textTransform: "uppercase",
                fontWeight: "bold",
                mb: 3,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              {category.replace("-", " ")} {category === "visit" ? "" : "In"}{" "}
              {country?.name.replace("-", " ")}
            </Typography>

            {/* Key Aspects Cards for Study Category */}
            {!loading &&
              isStudyData(countryData) &&
              countryData?.key_aspects && (
                <Box sx={{ mb: 4 }}>
                  <Grid2 container spacing={3}>
                    {countryData.key_aspects.intake && (
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card
                          sx={{
                            p: 3,
                            textAlign: "center",
                            height: "100%",
                            backgroundColor: "white",
                          }}
                        >
                          <AccountBalanceWalletIcon
                            sx={{ fontSize: 40, color: "#B90C1C", mb: 2 }}
                          />
                          <Typography variant="h6" fontWeight="bold" mb={1}>
                            Intakes
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {countryData.key_aspects.intake}
                          </Typography>
                        </Card>
                      </Grid2>
                    )}
                    {countryData.key_aspects.language_proficiency && (
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card
                          sx={{
                            p: 3,
                            textAlign: "center",
                            height: "100%",
                            backgroundColor: "white",
                          }}
                        >
                          <PersonIcon
                            sx={{ fontSize: 40, color: "#B90C1C", mb: 2 }}
                          />
                          <Typography variant="h6" fontWeight="bold" mb={1}>
                            Language Proficiency
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {countryData.key_aspects.language_proficiency}
                          </Typography>
                        </Card>
                      </Grid2>
                    )}
                    {countryData.key_aspects.post_study_work && (
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card
                          sx={{
                            p: 3,
                            textAlign: "center",
                            height: "100%",
                            backgroundColor: "white",
                          }}
                        >
                          <SendIcon
                            sx={{ fontSize: 40, color: "#B90C1C", mb: 2 }}
                          />
                          <Typography variant="h6" fontWeight="bold" mb={1}>
                            Post Study Work
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {countryData.key_aspects.post_study_work}
                          </Typography>
                        </Card>
                      </Grid2>
                    )}
                  </Grid2>
                </Box>
              )}

            {/* Key Aspects Cards - Above Overview */}
            {!loading &&
              isVisaData(countryData) &&
              countryData?.key_aspects && (
                <Box sx={{ mb: 4 }}>
                  <Grid2 container spacing={3}>
                    {countryData.key_aspects.validity && (
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card
                          sx={{
                            p: 3,
                            textAlign: "center",
                            height: "100%",
                            backgroundColor: "white", // 👈 set background to white
                          }}
                        >
                          <AccessTimeIcon
                            sx={{ fontSize: 40, color: "#B90C1C", mb: 2 }}
                          />
                          <Typography variant="h6" fontWeight="bold" mb={1}>
                            Visa Validity
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {countryData.key_aspects.validity}
                          </Typography>
                        </Card>

                      </Grid2>
                    )}
                    {countryData.key_aspects.entry_type && (
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card
                          sx={{
                            p: 3,
                            textAlign: "center",
                            height: "100%",
                            backgroundColor: "white",
                          }}
                        >
                          <FlightIcon
                            sx={{ fontSize: 40, color: "#B90C1C", mb: 2 }}
                          />
                          <Typography variant="h6" fontWeight="bold" mb={1}>
                            Entry Type
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {countryData.key_aspects.entry_type}
                          </Typography>
                        </Card>
                      </Grid2>
                    )}
                    {countryData.key_aspects.processing_time && (
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card
                          sx={{
                            p: 3,
                            textAlign: "center",
                            height: "100%",
                            backgroundColor: "white", // 👈 set background to white
                          }}
                        >
                          <DescriptionIcon
                            sx={{ fontSize: 40, color: "#B90C1C", mb: 2 }}
                          />
                          <Typography variant="h6" fontWeight="bold" mb={1}>
                            Visa Processing Time
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {countryData.key_aspects.processing_time}
                          </Typography>
                        </Card>
                      </Grid2>
                    )}
                  </Grid2>
                </Box>
              )}

            {/* Overview Section */}
            {loading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={100}
                sx={{ mb: 4, borderRadius: 2 }}
              />
            ) : (
              <Box
                sx={{
                  p: 3,
                  bgcolor: "background.paper",
                  borderRadius: 10,
                  border: "1px solid #e0e0e0",
                  mb: 4,
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  mb={2}
                  color="#B90C1C"
                >
                  Overview
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    lineHeight: 1.7,
                    fontStyle: "italic",
                  }}
                >
                  {countryData?.overview ??
                    `Discover everything you need to know about ${category.replace("-", " ")} in ${country?.name.replace("-", " ")}. Get detailed information about requirements, documentation, and processes.`}
                </Typography>
              </Box>
            )}

            {/* Accordions - Different rendering for Study vs Visit */}
            <Box sx={{ "& > *": { mb: 2 } }}>
              {category === "study" && isStudyData(countryData) ? (
                <>
                  

<Accordion title="Admission Requirements" defaultOpen>
                    <Box
                      sx={{
                        "& ul": {
                          listStyleType: "disc",
                          paddingLeft: "1.5rem",
                          mb: 2,
                        },
                        "& li": {
                          marginBottom: "0.5rem",
                          lineHeight: 1.6,
                        },
                        "& p": {
                          marginBottom: "1rem",
                          lineHeight: 1.7,
                          pl: 2,
                          borderLeft: "2px solid #E0E0E0",
                          "&:hover": {
                            borderLeft: "2px solid #B90C1C",
                            bgcolor: "rgba(185, 12, 28, 0.02)",
                          },
                          transition: "all 0.3s ease",
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: countryData?.req_adm
                          ? formatTextWithBold(countryData.req_adm)
                          : "<p><strong style='color: #B90C1C; font-weight: bold;'>Academic transcripts:</strong> Official academic records</p><p><strong style='color: #B90C1C; font-weight: bold;'>Language proficiency certificates:</strong> IELTS/TOEFL scores</p><p><strong style='color: #B90C1C; font-weight: bold;'>Personal statement:</strong> Statement of purpose</p><p><strong style='color: #B90C1C; font-weight: bold;'>Reference letters:</strong> Academic references</p>",
                      }}
                    />
                  </Accordion>

                  <Accordion title="Finances">
                    <Box
                      sx={{
                        "& ul": {
                          listStyleType: "decimal",
                          paddingLeft: "1.5rem",
                          mb: 2,
                        },
                        "& li": {
                          marginBottom: "0.8rem",
                          lineHeight: 1.6,
                          fontWeight: "500",
                        },
                        "& p": {
                          marginBottom: "1rem",
                          lineHeight: 1.7,
                          pl: 2,
                          borderLeft: "2px solid #E0E0E0",
                          "&:hover": {
                            borderLeft: "2px solid #B90C1C",
                            bgcolor: "rgba(185, 12, 28, 0.02)",
                          },
                          transition: "all 0.3s ease",
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: countryData?.finances
                          ? formatTextWithBold(countryData.finances)
                          : "<p><strong style='color: #B90C1C; font-weight: bold;'>Research and choose your institution:</strong> Select your preferred university</p><p><strong style='color: #B90C1C; font-weight: bold;'>Submit application with required documents:</strong> Complete application process</p><p><strong style='color: #B90C1C; font-weight: bold;'>Receive offer letter:</strong> Get acceptance from university</p><p><strong style='color: #B90C1C; font-weight: bold;'>Apply for student visa:</strong> Submit visa application</p><p><strong style='color: #B90C1C; font-weight: bold;'>Prepare for departure:</strong> Final preparations for travel</p>",
                      }}
                    />
                  </Accordion>

                  <Accordion title="Visa Requirements">
                    <Box
                      sx={{
                        "& ul": {
                          listStyleType: "disc",
                          paddingLeft: "1.5rem",
                          mb: 2,
                        },
                        "& li": {
                          marginBottom: "0.5rem",
                          lineHeight: 1.6,
                        },
                        "& p": {
                          marginBottom: "1rem",
                          lineHeight: 1.7,
                          pl: 2,
                          borderLeft: "2px solid #E0E0E0",
                          "&:hover": {
                            borderLeft: "2px solid #B90C1C",
                            bgcolor: "rgba(185, 12, 28, 0.02)",
                          },
                          transition: "all 0.3s ease",
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: countryData?.req_visa
                          ? formatTextWithBold(countryData.req_visa)
                          : "<p><strong style='color: #B90C1C; font-weight: bold;'>Visa application fee:</strong> Required visa processing fee</p><p><strong style='color: #B90C1C; font-weight: bold;'>Confirmation of acceptance:</strong> University acceptance letter</p><p><strong style='color: #B90C1C; font-weight: bold;'>Financial documents:</strong> Bank statements and financial proof</p><p><strong style='color: #B90C1C; font-weight: bold;'>Biometric data:</strong> Fingerprints and photo</p>",
                      }}
                    />
                  </Accordion>

                  <Accordion title="Additional Information">
                    <Box
                      sx={{
                        "& ul": {
                          listStyleType: "disc",
                          paddingLeft: "1.5rem",
                          mb: 2,
                        },
                        "& li": {
                          marginBottom: "0.5rem",
                          lineHeight: 1.6,
                        },
                        "& p": {
                          marginBottom: "1rem",
                          lineHeight: 1.7,
                          pl: 2,
                          borderLeft: "2px solid #E0E0E0",
                          "&:hover": {
                            borderLeft: "2px solid #B90C1C",
                            bgcolor: "rgba(185, 12, 28, 0.02)",
                          },
                          transition: "all 0.3s ease",
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: countryData?.additional
                          ? formatTextWithBold(countryData.additional)
                          : "<p>Additional helpful information for study applications:</p><p><strong style='color: #B90C1C; font-weight: bold;'>Processing times and fees:</strong> Current processing information</p><p><strong style='color: #B90C1C; font-weight: bold;'>Embassy contact details:</strong> Embassy contact information</p><p><strong style='color: #B90C1C; font-weight: bold;'>Important deadlines:</strong> Key application deadlines</p><p><strong style='color: #B90C1C; font-weight: bold;'>Support resources:</strong> Helpful resources and support</p>",
                      }}
                    />
                  </Accordion>

                  <Accordion title="Terms & Conditions">
                    <Box
                      sx={{
                        "& ul": {
                          listStyleType: "disc",
                          paddingLeft: "1.5rem",
                          mb: 2,
                        },
                        "& li": {
                          marginBottom: "0.5rem",
                          lineHeight: 1.6,
                        },
                        "& p": {
                          marginBottom: "1rem",
                          lineHeight: 1.7,
                          pl: 2,
                          borderLeft: "2px solid #E0E0E0",
                          "&:hover": {
                            borderLeft: "2px solid #B90C1C",
                            bgcolor: "rgba(185, 12, 28, 0.02)",
                          },
                          transition: "all 0.3s ease",
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: countryData?.terms
                          ? formatTextWithBold(countryData.terms)
                          : "<p>Additional helpful information for study applications:</p><p><strong style='color: #B90C1C; font-weight: bold;'>Processing times and fees:</strong> Current processing information</p><p><strong style='color: #B90C1C; font-weight: bold;'>Embassy contact details:</strong> Embassy contact information</p><p><strong style='color: #B90C1C; font-weight: bold;'>Important deadlines:</strong> Key application deadlines</p><p><strong style='color: #B90C1C; font-weight: bold;'>Support resources:</strong> Helpful resources and support</p>",
                      }}
                    />
                  </Accordion>
                </>
              ) : (
                /* Visit category accordions */
                <>
                  <Accordion title={<>General Checklist{" "}<span style={{ fontSize: "0.85rem", fontWeight: "normal" }}>(All Applicants)</span></>}defaultOpen>
                    <Box
                      sx={{
                        "& ul": {
                          listStyleType: "disc",
                          paddingLeft: "1.5rem",
                          mb: 2,
                        },
                        "& li": {
                          marginBottom: "0.5rem",
                          lineHeight: 1.6,
                        },
                        "& p": {
                          marginBottom: "1rem",
                          lineHeight: 1.7,
                          pl: 2,
                          borderLeft: "2px solid #E0E0E0",
                          "&:hover": {
                            borderLeft: "2px solid #B90C1C",
                            bgcolor: "rgba(185, 12, 28, 0.02)",
                          },
                          transition: "all 0.3s ease",
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: isVisaData(countryData)
                          ? formatTextWithBold(countryData.req_docs)
                          : "<p>Required documents for your application:</p><ul><li><strong style='color: #B90C1C; font-weight: bold;'>Valid Passport:</strong> Current and valid passport</li><li><strong style='color: #B90C1C; font-weight: bold;'>National Identity Card (CNIC):</strong> Valid CNIC</li><li><strong style='color: #B90C1C; font-weight: bold;'>Recent photographs:</strong> Passport size photos</li><li><strong style='color: #B90C1C; font-weight: bold;'>Application form:</strong> Completed application form</li></ul>",
                      }}
                    />
                  </Accordion>

                  <Accordion title={<>Employed Applicants{" "}<span style={{ fontSize: "0.85rem", fontWeight: "normal" }}>(Job Holders)</span></>}>
                    <Box
                      sx={{
                        "& ul": {
                          listStyleType: "disc",
                          paddingLeft: "1.5rem",
                          mb: 2,
                        },
                        "& li": {
                          marginBottom: "0.5rem",
                          lineHeight: 1.6,
                        },
                        "& p": {
                          marginBottom: "1rem",
                          lineHeight: 1.7,
                          pl: 2,
                          borderLeft: "2px solid #E0E0E0",
                          "&:hover": {
                            borderLeft: "2px solid #B90C1C",
                            bgcolor: "rgba(185, 12, 28, 0.02)",
                          },
                          transition: "all 0.3s ease",
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: isVisaData(countryData)
                          ? formatTextWithBold(countryData.employed)
                          : "<p>Additional requirements for employed applicants:</p><ul><li><strong style='color: #B90C1C; font-weight: bold;'>Employment certificate:</strong> From current employer</li><li><strong style='color: #B90C1C; font-weight: bold;'>Salary certificate:</strong> Recent salary proof</li><li><strong style='color: #B90C1C; font-weight: bold;'>Bank statements:</strong> Last 3 months</li><li><strong style='color: #B90C1C; font-weight: bold;'>Leave approval letter:</strong> Approved leave letter</li></ul>",
                      }}
                    />
                  </Accordion>

                  <Accordion title={<>Self-Employed Applicants{" "}<span style={{ fontSize: "0.85rem", fontWeight: "normal" }}>(Business Owners)</span></>}>
                    <Box
                      sx={{
                        "& ul": {
                          listStyleType: "disc",
                          paddingLeft: "1.5rem",
                          mb: 2,
                        },
                        "& li": {
                          marginBottom: "0.5rem",
                          lineHeight: 1.6,
                        },
                        "& p": {
                          marginBottom: "1rem",
                          lineHeight: 1.7,
                          pl: 2,
                          borderLeft: "2px solid #E0E0E0",
                          "&:hover": {
                            borderLeft: "2px solid #B90C1C",
                            bgcolor: "rgba(185, 12, 28, 0.02)",
                          },
                          transition: "all 0.3s ease",
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: isVisaData(countryData)
                          ? formatTextWithBold(countryData.self_employed)
                          : "<p>Requirements for self-employed applicants:</p><ul><li><strong style='color: #B90C1C; font-weight: bold;'>Business registration documents:</strong> Valid business registration</li><li><strong style='color: #B90C1C; font-weight: bold;'>Tax returns:</strong> Recent tax returns</li><li><strong style='color: #B90C1C; font-weight: bold;'>Business bank statements:</strong> Last 6 months</li><li><strong style='color: #B90C1C; font-weight: bold;'>Income proof:</strong> Business income documentation</li></ul>",
                      }}
                    />
                  </Accordion>

                  <Accordion title="Unemployed, Retired, or Dependent Applicants">
                    <Box
                      sx={{
                        "& ul": {
                          listStyleType: "disc",
                          paddingLeft: "1.5rem",
                          mb: 2,
                        },
                        "& li": {
                          marginBottom: "0.5rem",
                          lineHeight: 1.6,
                        },
                        "& p": {
                          marginBottom: "1rem",
                          lineHeight: 1.7,
                          pl: 2,
                          borderLeft: "2px solid #E0E0E0",
                          "&:hover": {
                            borderLeft: "2px solid #B90C1C",
                            bgcolor: "rgba(185, 12, 28, 0.02)",
                          },
                          transition: "all 0.3s ease",
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: isVisaData(countryData)
                          ? formatTextWithBold(countryData.unemployed)
                          : "<p>Requirements for unemployed applicants:</p><ul><li><strong style='color: #B90C1C; font-weight: bold;'>Sponsor documents:</strong> Valid sponsor documentation</li><li><strong style='color: #B90C1C; font-weight: bold;'>Financial support proof:</strong> Bank statements and income proof</li><li><strong style='color: #B90C1C; font-weight: bold;'>Relationship certificates:</strong> Proof of relationship with sponsor</li><li><strong style='color: #B90C1C; font-weight: bold;'>Sponsor's income proof:</strong> Sponsor's financial documentation</li></ul>",
                      }}
                    />
                  </Accordion>
                  <Accordion title="Additional Supporting Documents">
                    <Box
                      sx={{
                        "& ul": {
                          listStyleType: "disc",
                          paddingLeft: "1.5rem",
                          mb: 2,
                        },
                        "& li": {
                          marginBottom: "0.5rem",
                          lineHeight: 1.6,
                        },
                        "& p": {
                          marginBottom: "1rem",
                          lineHeight: 1.7,
                          pl: 2,
                          borderLeft: "2px solid #E0E0E0",
                          "&:hover": {
                            borderLeft: "2px solid #B90C1C",
                            bgcolor: "rgba(185, 12, 28, 0.02)",
                          },
                          transition: "all 0.3s ease",
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: isVisaData(countryData)
                          ? formatTextWithBold(countryData.additional)
                          : "<p>Additional helpful information:</p><ul><li><strong style='color: #B90C1C; font-weight: bold;'>Processing times and fees:</strong> Current processing information</li><li><strong style='color: #B90C1C; font-weight: bold;'>Embassy contact details:</strong> Embassy contact information</li><li><strong style='color: #B90C1C; font-weight: bold;'>Important deadlines and schedules:</strong> Key dates and timelines</li><li><strong style='color: #B90C1C; font-weight: bold;'>FAQ and support resources:</strong> Frequently asked questions</li></ul>",
                      }}
                    />
                  </Accordion>

                  <Accordion title="Key Considerations">
                    <Box
                      sx={{
                        "& ul": {
                          listStyleType: "disc",
                          paddingLeft: "1.5rem",
                          mb: 2,
                        },
                        "& li": {
                          marginBottom: "0.5rem",
                          lineHeight: 1.6,
                        },
                        "& p": {
                          marginBottom: "1rem",
                          lineHeight: 1.7,
                          pl: 2,
                          borderLeft: "2px solid #E0E0E0",
                          "&:hover": {
                            borderLeft: "2px solid #B90C1C",
                            bgcolor: "rgba(185, 12, 28, 0.02)",
                          },
                          transition: "all 0.3s ease",
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: isVisaData(countryData)
                          ? formatTextWithBold(countryData.considerations)
                          : "<p>Please read the following Key Considerations:</p><ul><li><strong style='color: #B90C1C; font-weight: bold;'>All documents must be original or properly attested:</strong> No photocopies accepted</li><li><strong style='color: #B90C1C; font-weight: bold;'>Application processing time may vary:</strong> Processing times are estimates</li><li><strong style='color: #B90C1C; font-weight: bold;'>Fees are non-refundable:</strong> Application fees cannot be refunded</li><li><strong style='color: #B90C1C; font-weight: bold;'>Additional documents may be requested:</strong> Embassy may request more documents</li></ul>",
                      }}
                    />
                  </Accordion>

                  <Accordion title="Terms & Conditions">
                    <Box
                      sx={{
                        "& ul": {
                          listStyleType: "disc",
                          paddingLeft: "1.5rem",
                          mb: 2,
                        },
                        "& li": {
                          marginBottom: "0.5rem",
                          lineHeight: 1.6,
                        },
                        "& p": {
                          marginBottom: "1rem",
                          lineHeight: 1.7,
                          pl: 2,
                          borderLeft: "2px solid #E0E0E0",
                          "&:hover": {
                            borderLeft: "2px solid #B90C1C",
                            bgcolor: "rgba(185, 12, 28, 0.02)",
                          },
                          transition: "all 0.3s ease",
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: isVisaData(countryData)
                          ? formatTextWithBold(countryData.terms)
                          : "<p>Please read the following terms and conditions carefully:</p><ul><li><strong style='color: #B90C1C; font-weight: bold;'>All documents must be original or properly attested:</strong> No photocopies accepted</li><li><strong style='color: #B90C1C; font-weight: bold;'>Application processing time may vary:</strong> Processing times are estimates</li><li><strong style='color: #B90C1C; font-weight: bold;'>Fees are non-refundable:</strong> Application fees cannot be refunded</li><li><strong style='color: #B90C1C; font-weight: bold;'>Additional documents may be requested:</strong> Embassy may request more documents</li></ul>",
                      }}
                    />
                  </Accordion>
                </>
              )}
            </Box>

            {/* Disclaimer Section - For both visit and study categories */}
            {!loading && 
              ((category === "visit" && isVisaData(countryData) && countryData?.disclaimer) ||
               (category === "study" && isStudyData(countryData) && countryData?.disclaimer)) && (
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  bgcolor: "rgba(255, 193, 7, 0.1)",
                  borderRadius: 2,
                  border: "1px solid #FFC107",
                  borderLeft: "4px solid #FFC107",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ mb: 2, color: "#E65100", display: "flex", alignItems: "center", gap: 1 }}
                >
                  ⚠️ Important Disclaimer
                </Typography>
                <Box
                  sx={{
                    "& p": {
                      marginBottom: "1rem",
                      lineHeight: 1.7,
                      color: "#424242",
                    },
                    "& ul": {
                      listStyleType: "disc",
                      paddingLeft: "1.5rem",
                      mb: 2,
                    },
                    "& li": {
                      marginBottom: "0.5rem",
                      lineHeight: 1.6,
                      color: "#424242",
                    },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: countryData.disclaimer,
                  }}
                />
              </Box>
            )}

            {/* Recommendations Section - Within main content for visit, study, and global-tourism categories */}
            {!loading && relatedCountries.length > 0 && (category === "visit" || category === "study" || category === "global-tourism") && (
              <Box sx={{ mt: 6 }}>
                <Box>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ 
                    mb: 1,
                    color: "#B90C1C",
                    fontSize: { xs: "1.5rem", md: "2rem" }
                  }}
                >
                  {category === "study" ? "🎓" : category === "global-tourism" ? "🌍" : "✈️"} Explore More {country?.continent} {category === "study" ? "Study" : category === "global-tourism" ? "Destinations" : "Destinations"}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ 
                    color: "#666",
                    maxWidth: "800px",
                    mx: "auto",
                    lineHeight: 1.6
                  }}
                >
                  Discover other amazing countries in {country?.continent} for {category === "study" ? "study opportunities" : category === "global-tourism" ? "tourism" : "travel"}
                </Typography>
              </Box>
              
              <Grid2 container spacing={3}>
                {relatedCountries.map((relatedCountry, index) => (
                  <Grid2 size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} key={index}>
                    <Link href={`/${category}/${relatedCountry.name.toLowerCase()}`}>
                      <Card
                        sx={{
                          p: 3,
                          textAlign: "center",
                          cursor: "pointer",
                          height: 160,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          background: "#ffffff",
                          border: "1px solid rgba(0,0,0,0.08)",
                          borderRadius: 3,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          "&:hover": {
                            transform: "translateY(-8px) scale(1.02)",
                            boxShadow: "0 20px 40px rgba(185, 12, 28, 0.15), 0 8px 16px rgba(0,0,0,0.1)",
                            borderColor: "rgba(185, 12, 28, 0.2)",
                            "& .flag-image": {
                              transform: "scale(1.1)",
                            },
                            "& .country-name": {
                              color: "#B90C1C",
                              transform: "translateY(-2px)",
                            }
                          },
                        }}
                      >
                        <Box
                          sx={{
                            mb: 2,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 60,
                          }}
                        >
                          <Image
                            className="flag-image"
                            src={relatedCountry.flag}
                            alt={`${relatedCountry.name} flag`}
                            width={80}
                            height={50}
                            style={{
                              borderRadius: "8px",
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                          />
                        </Box>
                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <Typography
                            className="country-name"
                            variant="body1"
                            fontWeight="600"
                            sx={{ 
                              color: "#333",
                              transition: "all 0.3s ease",
                              fontSize: "0.95rem",
                              letterSpacing: "0.5px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                              lineHeight: 1.2
                            }}
                            title={relatedCountry.name}
                          >
                            {relatedCountry.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ 
                              color: "#888",
                              display: "block",
                              mt: 0.5,
                              fontSize: "0.75rem"
                            }}
                          >
                            {category === "study" ? "Study Information" : category === "global-tourism" ? "Tourism Information" : "Visa Information"}
                          </Typography>
                        </Box>
                      </Card>
                    </Link>
                  </Grid2>
                ))}
              </Grid2>
              
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography
                  variant="body2"
                  sx={{ 
                    color: "#999",
                    fontStyle: "italic"
                  }}
                >
                  Click on any country to explore {category === "study" ? "study requirements and opportunities" : category === "global-tourism" ? "tourism packages and travel information" : "visa requirements and travel information"}
                </Typography>
              </Box>
                </Box>
              </Box>
            )}

          </Box>
        </Grid2>

        {/* Right Sidebar */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: "sticky", top: 20 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Quick Information
            </Typography>

            {/* Contact Information */}
            <Box
              sx={{
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 3,
                border: "1px solid #e0e0e0",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Quick Info - Logo/Label/Value Layout */}
              {!loading &&
                isVisaData(countryData) &&
                countryData?.quick_info && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      mb: 3,
                    }}
                  >
                    {countryData.quick_info.visa_fee && (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <AccountBalanceWalletIcon
                            sx={{ fontSize: 24, color: "#B90C1C" }}
                          />
                          <Typography variant="body1" fontWeight="medium">
                            Visa Fee
                          </Typography>
                        </Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          paddingLeft={1}
                        >
                          {countryData.quick_info.visa_fee}
                        </Typography>
                      </Box>
                    )}
                    {countryData.consultancy_charges && (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <HandshakeIcon
                            sx={{ fontSize: 24, color: "#B90C1C" }}
                          />
                          <Typography variant="body1" fontWeight="medium">
                            Consultancy Charges
                          </Typography>
                        </Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          paddingLeft={1}
                        >
                          {countryData.consultancy_charges}
                        </Typography>
                      </Box>
                    )}

                    {countryData.quick_info.interview && (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <PersonIcon sx={{ fontSize: 24, color: "#B90C1C" }} />
                          <Typography variant="body1" fontWeight="medium">
                            Interview
                          </Typography>
                        </Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          paddingLeft={1}
                        >
                          {countryData.quick_info.interview}
                        </Typography>
                      </Box>
                    )}
                    {countryData.quick_info.application_submission && (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <SendIcon sx={{ fontSize: 24, color: "#B90C1C" }} />
                          <Typography variant="body1" fontWeight="medium">
                            Application Submission
                          </Typography>
                        </Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          paddingLeft={1}
                        >
                          {countryData.quick_info.application_submission}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

              {/* Eligibility Criteria for Study Category */}
              {!loading &&
                isStudyData(countryData) &&
                countryData?.eligibility_crit && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Eligibility Criteria
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        maxHeight: 300,
                        overflowY: "auto",
                        "& ul": {
                          listStyleType: "disc",
                          paddingLeft: "1.5rem",
                          mb: 2,
                        },
                        "& li": {
                          marginBottom: "0.5rem",
                          lineHeight: 1.6,
                          fontSize: "0.9rem",
                        },
                        "& p": {
                          marginBottom: "1rem",
                          lineHeight: 1.7,
                          fontSize: "0.9rem",
                        },
                      }}
                    >
                      {(() => {
                        try {
                          // Try to parse as JSON first
                          const eligibilityData = JSON.parse(countryData.eligibility_crit);
                          return (
                            <Box>
                              {eligibilityData.minimum_education && (
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="subtitle2" fontWeight="bold" color="#B90C1C" mb={0.5}>
                                    Minimum Education:
                                  </Typography>
                                  <Typography variant="body2">
                                    {eligibilityData.minimum_education}
                                  </Typography>
                                </Box>
                              )}
                              {eligibilityData.minimum_marks && (
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="subtitle2" fontWeight="bold" color="#B90C1C" mb={0.5}>
                                    Minimum Marks:
                                  </Typography>
                                  <Typography variant="body2">
                                    {eligibilityData.minimum_marks}
                                  </Typography>
                                </Box>
                              )}
                              {eligibilityData.educational_gap && (
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="subtitle2" fontWeight="bold" color="#B90C1C" mb={0.5}>
                                    Educational Gap:
                                  </Typography>
                                  <Typography variant="body2">
                                    {eligibilityData.educational_gap}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          );
                        } catch {
                          // Fallback to HTML rendering if not valid JSON
                          return (
                            <Box
                              dangerouslySetInnerHTML={{
                                __html: countryData.eligibility_crit.replace(/\n/g, "<br/>"),
                              }}
                            />
                          );
                        }
                      })()}
                    </Box>
                  </Box>
                )}
                
              <Box
                sx={{
                  p: 2,
                  bgcolor: "rgba(185, 12, 28, 0.05)",
                  borderRadius: 2,
                  border: "1px solid rgba(185, 12, 28, 0.2)",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="#B90C1C"
                  mb={1}
                >
                  📞 Apply Now
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Contact{" "}
                  <a
                    href="https://wa.me/923259555999"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#25D366", textDecoration: "none", fontWeight: 500 }}
                  >
                    0325 9555 999
                  </a>{" "}
                  for expert guidance on your {category.replace("-", " ")} application to{" "}
                  {country?.name.replace("-", " ")}.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid2>
      </Grid2>
    </Container>
  );
}
