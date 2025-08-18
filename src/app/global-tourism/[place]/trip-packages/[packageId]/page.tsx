"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  Box,
  Container,
  Typography,
  Grid2,
  Card,
  Button,
  Divider,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HotelIcon from "@mui/icons-material/Hotel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { supabase } from "@/lib/supabase/server";
import { Accordion } from "@/components/Accordion";

interface TripPackage {
  id: number;
  int_tour_id: number;
  overview: string;
  adventure_plan: string;
  inclusions: string;
  exclusions: string;
  terms: string;
  tagline: string;
  created_at: string;
  // Optional fields that might be in your database
  destination?: string;
  days?: string;
  nights?: string;
  nearby?: string;
  title?: string;
  price?: string;
  duration?: string;
  hotel?: string;
  image?: string;
  description?: string;
}

// interface TripItinerary {
//   itinerary_id: number;
//   trip_id: number;
//   overview: string;
//   adventure_plan: string;
//   inclusions: string;
//   exclusions: string;
//   terms: string;
// }

export default function GlobalPackageDetailPage() {
  const { place, packageId } = useParams();
  const [tripPackage, setTripPackage] = useState<TripPackage | null>(null);
  // const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [otherPackages, setOtherPackages] = useState<TripPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);

        // Check if packageId is valid
        if (!packageId || Array.isArray(packageId)) {
          setError("Invalid package ID.");
          setOpenSnackbar(true);
          return;
        }

        const packageIdNumber = parseInt(packageId);
        if (isNaN(packageIdNumber)) {
          setError("Invalid package ID format.");
          setOpenSnackbar(true);
          return;
        }

        // Fetch main package details
        const { data: packageData, error: packageError } = await supabase
          .from("int_tour_itinerary")
          .select("*")
          .eq("id", packageIdNumber)
          .single();

        if (packageError) {
          setError("Failed to fetch package details.");
          setOpenSnackbar(true);
          return;
        }

        setTripPackage(packageData);
        // Since the package data already contains all itinerary info, we don't need a separate fetch
        // setItinerary(packageData);

        // Fetch other packages from the same destination
        const { data: otherPackagesData, error: otherPackagesError } =
          await supabase
            .from("international_tourism")
            .select("*")
            .eq("destination", place)
            .neq("int_tour_id", packageIdNumber)
            .limit(6);

        if (!otherPackagesError && otherPackagesData) {
          setOtherPackages(otherPackagesData);
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        setOpenSnackbar(true);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (packageId && place) {
      fetchPackageDetails();
    }
  }, [packageId, place]);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
          sx={{ mb: 4 }}
        />
        <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 4 }} />
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rectangular" width="100%" height={300} />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" width="100%" height={300} />
          </Grid2>
        </Grid2>
      </Container>
    );
  }

  if (!tripPackage) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h4" color="text.secondary" mb={2}>
            Package not found
          </Typography>
          <Link href="/global-tourism">
            <Button
              variant="contained"
              sx={{
                bgcolor: "#B90C1C",
                color: "white",
                "&:hover": { bgcolor: "#a00a18" },
              }}
            >
              Back to Global Tourism
            </Button>
          </Link>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Hero Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 300, md: 400 },
          mb: 4,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Image
          src={`/assets/global/${place}.jpg`}
          alt={tripPackage.title || `${tripPackage.destination} Package`}
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
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1,
            borderRadius: "12px",
          }}
        />
        {/* Overlay Content */}
        <Box
          sx={{
            position: "absolute",
            width: { xs: "100%" },
            top: "50%",
            left: { xs: "5%", md: "5%" },
            transform: "translateY(-50%)",
            color: "white",
            zIndex: 2,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Link href={`/global-tourism/${place}/trip-packages`}>
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
          <Typography variant="h3" fontWeight="bold" mb={1} fontStyle="italic">
            {tripPackage.tagline || tripPackage.title || "Luxury Tour Package"}
          </Typography>
        </Box>
      </Box>

      {/* Package Details */}
      <Grid2 container spacing={4}>
        {/* Left Column - Details */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          {/* Quick Info Cards */}
          <Grid2 container spacing={2} sx={{ mb: 4 }}>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Card sx={{ p: 2, textAlign: "center", bgcolor: "#f8f9fa" }}>
                <AccessTimeIcon sx={{ color: "#B90C1C", mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Duration
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {tripPackage.duration ||
                    `${tripPackage.days}D/${tripPackage.nights}N`}
                </Typography>
              </Card>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Card sx={{ p: 2, textAlign: "center", bgcolor: "#f8f9fa" }}>
                <HotelIcon sx={{ color: "#B90C1C", mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Accommodation
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {tripPackage.hotel || "Standard Hotel"}
                </Typography>
              </Card>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Card sx={{ p: 2, textAlign: "center", bgcolor: "#f8f9fa" }}>
                <LocationOnIcon sx={{ color: "#B90C1C", mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Destination
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {typeof place === "string" ? place.replace(/-/g, " ") : ""}
                </Typography>
              </Card>
            </Grid2>
          </Grid2>

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Overview
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                fontSize: "1.1rem",
                "& p": {
                  mb: 2,
                },
              }}
              dangerouslySetInnerHTML={{
                __html: tripPackage.overview,
              }}
            />
          </Box>

          {/* Itinerary Details */}
          {tripPackage && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight="bold" mb={3} color="#B90C1C">
                Trip Details
              </Typography>

              <Accordion title="Adventure Plan" defaultOpen={true}>
                <Box
                  sx={{
                    "& h1": {
                      display: "none", // Hide the h1 since we have our own header
                    },
                    "& h2": {
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      color: "#B90C1C !important",
                      mb: 2,
                      mt: 3,
                      "&:first-of-type": { mt: 0 },
                      borderLeft: "4px solid #B90C1C",
                      pl: 2,
                    },
                    "& p": {
                      mb: 1.5,
                      lineHeight: 1.7,
                      fontSize: "1rem",
                      color: "#000 !important",
                    },
                    "& *": {
                      color: "#000 !important",
                    },
                  }}
                >
                  <Typography
                    dangerouslySetInnerHTML={{
                      __html: tripPackage.adventure_plan,
                    }}
                  />
                </Box>
              </Accordion>

              {/* Terms & Conditions */}
              <Accordion title="Terms & Conditions">
                <Box
                  sx={{
                    "& h1": { display: "none" },
                    "& p": {
                      mb: 1.5,
                      lineHeight: 1.7,
                      fontSize: "0.95rem",
                      pl: 2,
                      borderLeft: "2px solid #E0E0E0",
                      "&:hover": {
                        borderLeft: "2px solid #B90C1C",
                        bgcolor: "rgba(185, 12, 28, 0.02)",
                      },
                      transition: "all 0.3s ease",
                    },
                  }}
                >
                  <Typography
                    dangerouslySetInnerHTML={{ __html: tripPackage.terms }}
                  />
                </Box>
              </Accordion>
            </Box>
          )}
        </Grid2>

        {/* Right Column - Booking Card */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h4" fontWeight="bold" color="#B90C1C" mb={2}>
              {tripPackage.price || "Contact for Price"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Per person (inclusive of all taxes)
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" fontWeight="bold" mb={2}>
              What&apos;s Included:
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      "<ul style='margin: 0; padding-left: 20px;'>" +
                      tripPackage.inclusions
                        .split("\n")
                        .filter((item) => item.trim() !== "")
                        .map((item) =>
                          item.replace(/<p>/g, "").replace(/<\/p>/g, "")
                        )
                        .filter((item) => item.trim() !== "")
                        .map(
                          (item) =>
                            `<li style='margin-bottom: 8px; color: #333;'>✓ ${item.trim()}</li>`
                        )
                        .join("") +
                      "</ul>",
                  }}
                />
              </Typography>
            </Box>

            <Typography variant="h6" fontWeight="bold" mb={2}>
              What&apos;s Excluded:
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      "<ul style='margin: 0; padding-left: 20px;'>" +
                      tripPackage.exclusions
                        .split("\n")
                        .filter((item) => item.trim() !== "")
                        .map((item) =>
                          item.replace(/<p>/g, "").replace(/<\/p>/g, "")
                        )
                        .filter((item) => item.trim() !== "")
                        .map(
                          (item) =>
                            `<li style='margin-bottom: 8px; color: #333;'>✗ ${item.trim()}</li>`
                        )
                        .join("") +
                      "</ul>",
                  }}
                />
              </Typography>
            </Box>

            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderColor: "#B90C1C",
                color: "#B90C1C",
                "&:hover": { borderColor: "#a00a18", color: "#a00a18" },
              }}
            >
              Contact Us
            </Button>
          </Card>
        </Grid2>
      </Grid2>

      {/* Other Packages Section */}
      {otherPackages.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" fontWeight="bold" mb={4} color="#B90C1C">
            Other Packages
          </Typography>
          <Grid2 container spacing={3}>
            {otherPackages.map((pkg) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={pkg.int_tour_id}>
                <Link
                  href={`/global-tourism/${place}/trip-packages/${pkg.int_tour_id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <Box
                      sx={{ position: "relative", width: "100%", height: 180 }}
                    >
                      <Image
                        src={`/assets/global/${place}.jpg`}
                        alt={pkg.tagline || `${place} Package`}
                        fill
                        style={{
                          objectFit: "cover",
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        }}
                        loading="lazy"
                      />
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" fontWeight="bold" mb={1}>
                        {pkg.tagline || `${place} Tour Package`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Destination:{" "}
                        {typeof place === "string"
                          ? place.replace(/-/g, " ")
                          : ""}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {pkg.overview
                          ? pkg.overview.substring(0, 100) + "..."
                          : "Luxury travel experience"}
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="#B90C1C"
                      >
                        Contact for Price
                      </Typography>
                    </Box>
                  </Card>
                </Link>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      )}
    </Container>
  );
}
