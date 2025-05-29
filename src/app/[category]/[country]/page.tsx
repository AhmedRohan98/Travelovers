// /app/(routes)/countries/[category]/[country]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { getCountriesByCategory } from "@/lib/data/countries";
import Link from "next/link";
import Image from "next/image";
import { Box, Container, Typography } from "@mui/material";
import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Accordion } from "@/components/Accordion";
import { supabase } from "@/lib/supabase/server";

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

  const fetchCountries = async () => {
    const { data, error } = await supabase
      .from("visa_country")
      .select("*")
      .eq("name", countryName);
    if (error) {
      console.error("Error fetching countries:", error);
      return [];
    }
    if (data) console.log("Fetched countries:", data);
  };

  fetchCountries();

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Banner */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 600,
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
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: 16,
              fontStyle: "italic",
            }}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
            perspiciatis ducimus excepturi quo! Molestiae illum corrupti eius
            praesentium excepturi. Quod obcaecati eius repudiandae quis nemo!
            Praesentium dolores perferendis beatae animi corporis? Sequi aliquam
            repellat in mollitia placeat labore quisquam.
          </Typography>
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
      <Accordion title="Eligibility Criteria">
        <p>
          You can return any item within 30 days of purchase. Please ensure the
          item is in its original condition.
        </p>
      </Accordion>
      <Accordion title="Required Documents for Admission">
        <p>
          Shipping usually takes 5-7 business days depending on your location.
        </p>
      </Accordion>
      <Accordion title="Required Documents for Visa">
        <p>
          Shipping usually takes 5-7 business days depending on your location.
        </p>
      </Accordion>
      <Accordion title="Finances & Expenses">
        <p>
          Shipping usually takes 5-7 business days depending on your location.
        </p>
      </Accordion>
      <Accordion title="Terms & Conditions">
        <p>
          Shipping usually takes 5-7 business days depending on your location.
        </p>
      </Accordion>
      <Accordion title="Application Process">
        <p>
          Shipping usually takes 5-7 business days depending on your location.
        </p>
      </Accordion>
    </Container>
  );
}
