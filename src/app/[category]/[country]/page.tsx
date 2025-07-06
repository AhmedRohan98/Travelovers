"use client";

import { useParams } from "next/navigation";
import { getCountriesByCategory } from "@/lib/data/countries";
import Link from "next/link";
import Image from "next/image";
import { Box, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
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
}

export default function CountryDetailPage() {
  const params = useParams();
  const category = params.category as string;
  const countryName = params.country as string;

  const countries = getCountriesByCategory(category);
  const country = countries.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase()
  );

  const [countryData, setCountryData] = useState<CountryVisaData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (category === "study" || category === "visit") {
      const fetchCountries = async () => {
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
          setCountryData(data);
          setFetchError(null);
        }
      };

      fetchCountries();
    } else {
      setCountryData(null);
    }
  }, [category, countryName]);

  if (!country) {
    return <div className="container mx-auto py-8">Country not found</div>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Snackbar for fetch errors */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
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
      {/* Banner */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 450,
          mb: 4,
          backgroundImage: `url('${
            category === "national-tourism"
              ? `/assets/places/${countryName}.jpg`
              : `/assets/countries/${category}/place/${countryName}.jpg`
          }')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "black",
          zIndex: 0,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Overlay Content */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            top: "50%",
            left: "5%",
            transform: "translateY(-50%)",
            color: "white",
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              color: "white",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
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
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                textTransform: "uppercase",
                fontStyle: "italic",
                wordBreak: "break-word",
                whiteSpace: "normal",
                lineHeight: 1.1,
                hyphens: "auto",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              {country.name.replace("-", " ")}
            </Typography>
            {category !== "national-tourism" && "flag" in country && (
              <Box>
                <Image
                  src={country.flag}
                  alt="country"
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
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1,
            borderRadius: "12px",
          }}
        />
      </Box>
      <Box
        sx={{
          marginBottom: "12px",
          width: "80%",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: "#660D17",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          {category.replace("-", " ")} {category === "visit" ? "" : "In"}{" "}
          {country.name.replace("-", " ")}
        </Typography>
        {/* Skeleton loader for overview */}
        {(category === "study" || category === "visit") &&
        !countryData &&
        !fetchError ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={60}
            sx={{ mb: 2, borderRadius: 2 }}
          />
        ) : (
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: 18,
              fontStyle: "italic",
              padding: "8px",
              color: "#000000",
            }}
          >
            {countryData?.overview ??
              "No description available for this country at the moment."}
          </Typography>
        )}
        {/* Add Trip Packages button for national tourism */}
        {category === "national-tourism" && (
          <Box sx={{ mb: 3 }}>
            <Link
              href={`/national-tourism/${countryName}/trip-packages`}
              style={{
                display: "inline-block",
                background: "#AB142A",
                color: "white",
                padding: "12px 32px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "1.1rem",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
            >
              View Trip Packages
            </Link>
          </Box>
        )}
      </Box>

      <Accordion title="Required Documents">
        <Box
          sx={{
            "& ul": {
              listStyleType: "disc",
              paddingLeft: "1.5rem",
              color: "#000000",
            },
            "& li": {
              color: "#000000",
              marginBottom: "0.5rem",
            },
            "& p": {
              color: "#000000",
              marginBottom: "1rem",
            },
          }}
          dangerouslySetInnerHTML={{
            __html:
              countryData?.req_docs ??
              "<p>You can return any item within 30 days of purchase.</p><ul><li>Passport</li><li>CNIC</li></ul>",
          }}
        />
      </Accordion>
      <Accordion title="Employed">
        <Box
          sx={{
            "& ul": {
              color: "#000000",
              listStyleType: "disc",
              paddingLeft: "1.5rem",
            },
            "& li": {
              color: "#000000",
              marginBottom: "0.5rem",
            },
            "& p": {
              color: "#000000",
              marginBottom: "1rem",
            },
          }}
          dangerouslySetInnerHTML={{
            __html:
              countryData?.employed ??
              "<p>You can return any item within 30 days of purchase. Please ensure the item is in its original condition.</p>",
          }}
        />
      </Accordion>
      <Accordion title="Self Employed">
        <Box
          sx={{
            "& ul": {
              color: "#000000",
              listStyleType: "disc",
              paddingLeft: "1.5rem",
            },
            "& li": {
              color: "#000000",
              marginBottom: "0.5rem",
            },
            "& p": {
              color: "#000000",
              marginBottom: "1rem",
            },
          }}
          dangerouslySetInnerHTML={{
            __html:
              countryData?.self_employed ??
              "<p>You can return any item within 30 days of purchase. Please ensure the item is in its original condition.</p>",
          }}
        />
      </Accordion>
      <Accordion title="Unemployed">
        <Box
          sx={{
            "& ul": {
              color: "#000000",
              listStyleType: "disc",
              paddingLeft: "1.5rem",
            },
            "& li": {
              color: "#000000",
              marginBottom: "0.5rem",
            },
            "& p": {
              color: "#000000",
              marginBottom: "1rem",
            },
          }}
          dangerouslySetInnerHTML={{
            __html:
              countryData?.unemployed ??
              "<p>You can return any item within 30 days of purchase. Please ensure the item is in its original condition.</p>",
          }}
        />
      </Accordion>
      <Accordion title="Terms & Conditions">
        <Box
          sx={{
            "& ul": {
              color: "#000000",
              listStyleType: "disc",
              paddingLeft: "1.5rem",
            },
            "& li": {
              color: "#000000",
              marginBottom: "0.5rem",
            },
            "& p": {
              color: "#000000",
              marginBottom: "1rem",
            },
          }}
          dangerouslySetInnerHTML={{
            __html:
              countryData?.terms ??
              "<p>You can return any item within 30 days of purchase. Please ensure the item is in its original condition.</p>",
          }}
        />
      </Accordion>
      <Accordion title="Additional Information">
        <Box
          sx={{
            "& ul": {
              color: "#000000",
              listStyleType: "disc",
              paddingLeft: "1.5rem",
            },
            "& li": {
              color: "#000000",
              marginBottom: "0.5rem",
            },
            "& p": {
              color: "#000000",
              marginBottom: "1rem",
            },
          }}
          dangerouslySetInnerHTML={{
            __html:
              countryData?.additional ??
              "<p>You can return any item within 30 days of purchase. Please ensure the item is in its original condition.</p>",
          }}
        />
      </Accordion>
    </Container>
  );
}
