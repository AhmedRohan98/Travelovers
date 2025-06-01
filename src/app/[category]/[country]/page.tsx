// /app/(routes)/countries/[category]/[country]/page.tsx
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

  useEffect(() => {
    const fetchCountries = async () => {
      const tableName = category === "study" ? "study_country" : "visa_country";

      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("name", countryName)
        .single();

      if (error) {
        console.error("Error fetching countries:", error);
      } else {
        setCountryData(data);
      }
    };

    fetchCountries();
  }, [countryName]);

  if (!country) {
    return <div className="container mx-auto py-8">Country not found</div>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Banner */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 450,
          mb: 4,
          backgroundImage: `url('/assets/countries/${category}/place/${countryName}.jpg')`,
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
            width: "50%",
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
              }}
            >
              {country.name.replace("-", " ")}
            </Typography>
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
          {category} {category === "visit" ? "" : "In"} {country.name.replace("-", " ")}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: 18,
            fontStyle: "italic",
            padding: "8px",
          }}
        >
          {`${
            countryData?.overview === null
              ? " Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis perspiciatis ducimus excepturi quo! Molestiae illum corrupti eius praesentium excepturi. Quod obcaecati eius repudiandae quis nemo! Praesentium dolores perferendis beatae animi corporis? Sequi aliquam repellat in mollitia placeat labore quisquam."
              : countryData?.overview
          }`}
        </Typography>
      </Box>

      <Accordion title="Required Documents">
        <Box
          sx={{
            "& ul": {
              listStyleType: "disc",
              paddingLeft: "1.5rem",
            },
            "& li": {
              marginBottom: "0.5rem",
            },
            "& p": {
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
              listStyleType: "disc",
              paddingLeft: "1.5rem",
            },
            "& li": {
              marginBottom: "0.5rem",
            },
            "& p": {
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
              listStyleType: "disc",
              paddingLeft: "1.5rem",
            },
            "& li": {
              marginBottom: "0.5rem",
            },
            "& p": {
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
              listStyleType: "disc",
              paddingLeft: "1.5rem",
            },
            "& li": {
              marginBottom: "0.5rem",
            },
            "& p": {
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
              listStyleType: "disc",
              paddingLeft: "1.5rem",
            },
            "& li": {
              marginBottom: "0.5rem",
            },
            "& p": {
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
              listStyleType: "disc",
              paddingLeft: "1.5rem",
            },
            "& li": {
              marginBottom: "0.5rem",
            },
            "& p": {
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
