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
  // From international_tourism table
  int_tour_id: number;
  destination: string;
  title: string;
  days: number;
  nights: number;
  created_at: string;
  // From int_tour_itinerary table
  id?: number;
  overview?: string;
  adventure_plan?: string;
  inclusions?: string;
  exclusions?: string;
  terms?: string;
  tagline?: string;
  top_attractions?: string;
  // Optional fields
  nearby?: string;
  price?: string;
  duration?: string;
  hotel?: string;
  image?: string;
  description?: string;
}

interface TripItinerary {
  id: number;
  int_tour_id: number;
  overview: string;
  adventure_plan: string;
  inclusions: string;
  exclusions: string;
  terms: string;
  tagline: string;
  top_attractions: string;
  created_at: string;
}

export default function GlobalPackageDetailPage() {
  const { place, packageId } = useParams();
  const [packageData, setPackageData] = useState<TripPackage | null>(null);
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [otherPackages, setOtherPackages] = useState<TripPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        setLoading(true);

        // Validate parameters
        const packageIdStr = Array.isArray(packageId)
          ? packageId[0]
          : packageId;
        const placeStr = Array.isArray(place) ? place[0] : place;

        if (!packageIdStr || !placeStr) {
          setError("Invalid package ID or destination.");
          setOpenSnackbar(true);
          return;
        }

        console.log("Fetching package for:", { packageIdStr, placeStr });

        // Fetch main package details from international_tourism table
        const { data: packageData, error: packageError } = await supabase
          .from("international_tourism")
          .select("*")
          .eq("int_tour_id", parseInt(packageIdStr))
          .eq("destination", placeStr)
          .single();

        console.log("Package query result:", { packageData, packageError });

        if (packageError) {
          setError("Failed to fetch package details. Please try again later.");
          setOpenSnackbar(true);
          console.error("Package fetch error:", packageError);
          return;
        }

        if (!packageData) {
          setError("Package not found.");
          setOpenSnackbar(true);
          return;
        }

        setPackageData(packageData);

        // Fetch itinerary data from int_tour_itinerary table
        console.log(
          "Attempting to fetch itinerary for packageId:",
          packageIdStr
        );

        try {
          const { data: itineraryData, error: itineraryError } = await supabase
            .from("int_tour_itinerary")
            .select("*")
            .eq("int_tour_id", parseInt(packageIdStr))
            .single();

          console.log("Itinerary query result:", {
            itineraryData,
            itineraryError,
          });

          if (itineraryError) {
            console.error("Itinerary fetch error:", itineraryError);
            setItinerary(null);
          } else {
            setItinerary(itineraryData);
          }
        } catch (itineraryError) {
          console.error("Unexpected itinerary error:", itineraryError);
          setItinerary(null);
        }

        // Fetch other packages from the same destination (excluding current package)
        try {
          const { data: otherPackagesData, error: otherPackagesError } =
            await supabase
              .from("international_tourism")
              .select("*")
              .eq("destination", placeStr)
              .neq("int_tour_id", parseInt(packageIdStr))
              .limit(6);

          console.log("Other packages query result:", {
            otherPackagesData,
            otherPackagesError,
          });

          if (!otherPackagesError && otherPackagesData) {
            setOtherPackages(otherPackagesData);
          }
        } catch (otherPackagesError) {
          console.error("Other packages fetch error:", otherPackagesError);
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
      fetchPackageData();
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

  if (!packageData) {
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
          alt={packageData?.title || `${packageData?.destination} Package`}
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
            {(() => {
              const placeStr = Array.isArray(place) ? place[0] : place;
              return placeStr
                ? placeStr.charAt(0).toUpperCase() + placeStr.slice(1)
                : "";
            })()}
            {" - "}
            {itinerary?.tagline || packageData?.title || "Luxury Tour Package"}
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
                <Typography variant="body2" color="text.secondary">
                  {packageData?.days || "N/A"} Days /{" "}
                  {packageData?.nights || "N/A"} Nights
                </Typography>
              </Card>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Card sx={{ p: 2, textAlign: "center", bgcolor: "#f8f9fa" }}>
                <HotelIcon sx={{ color: "#B90C1C", mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Accommodation
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {itinerary?.top_attractions || "Standard"}
                </Typography>
              </Card>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Card sx={{ p: 2, textAlign: "center", bgcolor: "#f8f9fa" }}>
                <LocationOnIcon sx={{ color: "#B90C1C", mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Destination
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {typeof place === "string"
                    ? place.replace(/-/g, " ").charAt(0).toUpperCase() +
                      place.slice(1)
                    : ""}
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
                __html: itinerary?.overview || "No overview available.",
              }}
            />
          </Box>

          {/* Itinerary Details */}
          {(packageData || itinerary) && (
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
                      __html:
                        itinerary?.adventure_plan ||
                        "No adventure plan available.",
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
                    dangerouslySetInnerHTML={{
                      __html: itinerary?.terms || "No terms available.",
                    }}
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
              {packageData?.price || "Contact for Price"}
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
                      itinerary?.inclusions
                        ?.split("\n")
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
                      itinerary?.exclusions
                        ?.split("\n")
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
