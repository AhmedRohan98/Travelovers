"use client";

import { useParams } from "next/navigation";
import {
  getCountriesByCategory,
  getCountriesByCategoryAsync,
  getRelatedVisitCountries,
  getVisitCountries,
  getGlobalTourismCountries,
} from "@/lib/data/countries";
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
    submission?: string;
  };
  considerations: string;
}

interface CountryStudyData {
  id: number;
  name: string;
  overview: string;
  eligibility_crit: string;
  guide: string;
  req_adm: string;
  req_visa: string;
  additional: string;
  created_at: string;
}

export default function CountryDetailPage() {
  const params = useParams();
  const category = params.category as string;
  const countryName = params.country as string;

  const [countries, setCountries] = useState<any[]>([]);
  const [country, setCountry] = useState<any>(null);
  const [countryData, setCountryData] = useState<
    CountryVisaData | CountryStudyData | null
  >(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [relatedCountries, setRelatedCountries] = useState<any[]>([]);

  // Fetch countries based on category
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        let countriesData;
        if (category === "global-tourism") {
          countriesData = await getGlobalTourismCountries();
        } else if (category === "visit") {
          countriesData = await getVisitCountries();
        } else {
          countriesData = getCountriesByCategory(category);
        }
        setCountries(countriesData);
        
        const foundCountry = countriesData.find(
          (c: any) => c.name.toLowerCase() === countryName.toLowerCase()
        );
        setCountry(foundCountry);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountries([]);
        setCountry(null);
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
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq("name", countryName)
          .single();

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
              : data.quick_info
          };
          console.log('Processed country data:', processedData);
          setCountryData(processedData);
          setFetchError(null);
          
          // Fetch related countries for visit category
          if (category === "visit" && data.continent) {
            const related = await getRelatedVisitCountries(countryName, data.continent, 5);
            setRelatedCountries(related);
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

  if (!country) {
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
          alt={`${country.name} Banner`}
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
                {country.name.replace("-", " ")}
              </Typography>
              {category !== "national-tourism" && "flag" in country && (
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
                {country.name.replace("-", " ")}
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
              {country.name.replace("-", " ")}
            </Typography>

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
                            Validity
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
                            Processing Time
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
                    `Discover everything you need to know about ${category.replace("-", " ")} in ${country.name.replace("-", " ")}. Get detailed information about requirements, documentation, and processes.`}
                </Typography>
              </Box>
            )}

            {/* Accordions - Different rendering for Study vs Visit */}
            <Box sx={{ "& > *": { mb: 2 } }}>
              {category === "study" && isStudyData(countryData) ? (
                <>
                  <Accordion title="Eligibility Criteria">
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
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          countryData?.eligibility_crit?.replace(
                            /\n/g,
                            "<br/>"
                          ) ??
                          "<p>Minimum eligibility criteria for study applications:</p><ul><li>Completed secondary education</li><li>English language proficiency</li><li>Financial support proof</li><li>Academic transcripts</li></ul>",
                      }}
                    />
                  </Accordion>

                  <Accordion title="Step-by-Step Application Guide">
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
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          countryData?.guide
                            ?.replace(/\n/g, "</li><li>")
                            .replace(/^/, "<li>")
                            .replace(/$/, "</li>") ??
                          "<ol><li>Research and choose your institution</li><li>Submit application with required documents</li><li>Receive offer letter</li><li>Apply for student visa</li><li>Prepare for departure</li></ol>",
                      }}
                    />
                  </Accordion>

                  <Accordion title="Admission Requirements">
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
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          countryData?.req_adm
                            ?.replace(/\n/g, "</li><li>")
                            .replace(/^/, "<ul><li>")
                            .replace(/$/, "</li></ul>") ??
                          "<ul><li>Academic transcripts</li><li>Language proficiency certificates</li><li>Personal statement</li><li>Reference letters</li></ul>",
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
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          countryData?.req_visa
                            ?.replace(/\n/g, "</li><li>")
                            .replace(/^/, "<ul><li>")
                            .replace(/$/, "</li></ul>") ??
                          "<ul><li>Visa application fee</li><li>Confirmation of acceptance</li><li>Financial documents</li><li>Biometric data</li></ul>",
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
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          countryData?.additional ??
                          "<p>Additional helpful information for study applications:</p><ul><li>Processing times and fees</li><li>Embassy contact details</li><li>Important deadlines</li><li>Support resources</li></ul>",
                      }}
                    />
                  </Accordion>
                </>
              ) : (
                /* Visit category accordions */
                <>
                  <Accordion title="General Checklist (All Applicants)" defaultOpen>
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
                          ? countryData.req_docs
                          : "<p>Required documents for your application:</p><ul><li>Valid Passport</li><li>National Identity Card (CNIC)</li><li>Recent photographs</li><li>Application form</li></ul>",
                      }}
                    />
                  </Accordion>

                  <Accordion title="Employed Applicants (Job Holders)">
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
                          ? countryData.employed
                          : "<p>Additional requirements for employed applicants:</p><ul><li>Employment certificate</li><li>Salary certificate</li><li>Bank statements</li><li>Leave approval letter</li></ul>",
                      }}
                    />
                  </Accordion>

                  <Accordion title="Self-Employed Applicants (Business Owners)">
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
                          ? countryData.self_employed
                          : "<p>Requirements for self-employed applicants:</p><ul><li>Business registration documents</li><li>Tax returns</li><li>Business bank statements</li><li>Income proof</li></ul>",
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
                          ? countryData.unemployed
                          : "<p>Requirements for unemployed applicants:</p><ul><li>Sponsor documents</li><li>Financial support proof</li><li>Relationship certificates</li><li>Sponsor&apos;s income proof</li></ul>",
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
                          ? countryData.additional
                          : "<p>Additional helpful information:</p><ul><li>Processing times and fees</li><li>Embassy contact details</li><li>Important deadlines and schedules</li><li>FAQ and support resources</li></ul>",
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
                          ? countryData.considerations
                          : "<p>Please read the following Key Considerations:</p><ul><li>All documents must be original or properly attested</li><li>Application processing time may vary</li><li>Fees are non-refundable</li><li>Additional documents may be requested</li></ul>",
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
                          ? countryData.terms
                          : "<p>Please read the following terms and conditions carefully:</p><ul><li>All documents must be original or properly attested</li><li>Application processing time may vary</li><li>Fees are non-refundable</li><li>Additional documents may be requested</li></ul>",
                      }}
                    />
                  </Accordion>
                </>
              )}
            </Box>

            {/* Disclaimer Section - Only for visit category */}
            {category === "visit" && !loading && isVisaData(countryData) && countryData?.disclaimer && (
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

            {/* Recommendations Section - Within main content for visit category */}
            {category === "visit" && !loading && relatedCountries.length > 0 && (
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
                  ✈️ Explore More {country?.continent} Destinations
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
                  Discover other amazing countries in {country?.continent} that might interest you
                </Typography>
              </Box>
              
              <Grid2 container spacing={3}>
                {relatedCountries.map((relatedCountry, index) => (
                  <Grid2 size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} key={index}>
                    <Link href={`/visit/${relatedCountry.name.toLowerCase()}`}>
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
                            Visa Information
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
                  Click on any country to explore visa requirements and travel information
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
                    {countryData.quick_info.submission && (
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
                            Submission
                          </Typography>
                        </Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          paddingLeft={1}
                        >
                          {countryData.quick_info.submission}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Need Help?
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Contact our expert consultants for personalized assistance
                  with your application.
                </Typography>
              </Box>

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
                  📞 Expert Consultation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get professional guidance for your{" "}
                  {category.replace("-", " ")} application to{" "}
                  {country.name.replace("-", " ")}.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid2>
      </Grid2>
    </Container>
  );
}
