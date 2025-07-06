"use client";
import React from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { tripPackages } from "@/lib/data/tripPackages";
import Link from "next/link";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";

export default function TripPackagesPage() {
  const { place } = useParams();
  const packages = tripPackages[place as keyof typeof tripPackages];
  const heroImage = packages[0]?.image || "/assets/places/hunza.jpg";

  if (!packages) return notFound();

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Banner/Header - MUI style like CountryDetailPage */}
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
          src={heroImage}
          alt="Banner"
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
          <Link href={`/national-tourism/${place}`}>
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
            <span
              style={{
                background: "linear-gradient(90deg, white 0%, #B90C17 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
                paddingRight: "0.15em",
              }}
            >
              {typeof place === "string" ? place.replace(/-/g, " ") : ""}
            </span>{" "}
            Packages
          </Typography>
        </Box>
      </Box>

      {/* Title */}
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          py: { xs: 4, md: 8 },
          px: { xs: 1, sm: 2, md: 4 },
        }}
      >
        <Typography variant="h3" fontWeight="bold" mb={4}>
          <Box component="span" color="black">
            Trip
          </Box>{" "}
          Packages
        </Typography>

        {/* Packages Grid */}
        <Grid container spacing={4}>
          {packages.map((pkg, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Box sx={{ position: "relative", width: "100%", height: 180 }}>
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    style={{
                      objectFit: "cover",
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                    loading="lazy"
                  />
                </Box>
                <CardContent
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      {pkg.title}
                    </Typography>
                    <Typography
                      align="right"
                      fontWeight="bold"
                      color="text.secondary"
                      mb={1}
                    >
                      {pkg.price}
                    </Typography>
                    <Box
                      component="ul"
                      sx={{
                        pl: 2,
                        mb: 2,
                        color: "text.secondary",
                        fontSize: 15,
                      }}
                    >
                      <li>⏱️ Duration: {pkg.duration}</li>
                      <li>🏨 Hotel: {pkg.hotel}</li>
                      <li>🌲 Nearby Places: {pkg.nearby}</li>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                      mt: "auto",
                      width: "100%",
                      bgcolor: "#AB142A",
                      color: "white",
                      borderRadius: "8px",
                      fontWeight: 600,
                      py: 1.5,
                      "&:hover": { bgcolor: "#a00a18" },
                    }}
                  >
                    Check Out
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
