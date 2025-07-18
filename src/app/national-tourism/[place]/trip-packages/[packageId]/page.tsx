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
  trip_id: number;
  destination: string;
  days: string;
  nights: string;
  nearby: string;
  created_at: string;
  // Add other fields that might be in your database
  title?: string;
  price?: string;
  duration?: string;
  hotel?: string;
  image?: string;
  description?: string;
}

interface TripItinerary {
  itinerary_id: number;
  trip_id: number;
  overview: string;
  adventure_plan: string;
  inclusions: string;
  exclusions: string;
  terms: string;
}

export default function PackageDetailPage() {
  const { place, packageId } = useParams();
  const [packageData, setPackageData] = useState<TripPackage | null>(null);
  const [itinerary, setItinerary] = useState<TripItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        setLoading(true);

        // Ensure parameters are strings
        const placeStr = Array.isArray(place) ? place[0] : place;
        const packageIdStr = Array.isArray(packageId)
          ? packageId[0]
          : packageId;

        // Validate parameters
        if (!placeStr || !packageIdStr) {
          setError("Invalid parameters provided.");
          setOpenSnackbar(true);
          return;
        }

        console.log("Fetching package data for:", {
          packageId: packageIdStr,
          place: placeStr,
        });
        console.log("Parameter types:", {
          packageIdType: typeof packageIdStr,
          placeType: typeof placeStr,
        });

        // Fetch package data
        const { data: packageData, error: packageError } = await supabase
          .from("trips")
          .select("*")
          .eq("trip_id", parseInt(packageIdStr))
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

        // Fetch itinerary data for debugging
        console.log(
          "Attempting to fetch itinerary for packageId:",
          packageIdStr
        );

        try {
          // Use the JOIN query as specified:
          // SELECT ti.* FROM trip_itinerary ti JOIN trips t ON ti.trip_id = t.trip_id WHERE LOWER(t.destination) = 'kumrat'
          const { data: itineraryData, error: itineraryError } = await supabase
            .from("trip_itinerary")
            .select(
              `
              *,
              trips!inner(destination)
            `
            )
            .eq("trips.destination", placeStr.toLowerCase());

          console.log("Itinerary JOIN query result:", {
            itineraryData,
            itineraryError,
          });

          if (itineraryError) {
            console.error("Itinerary fetch error:", itineraryError);
            setItinerary([]);
          } else {
            setItinerary(itineraryData || []);
          }
        } catch (err) {
          console.error("Itinerary fetch exception:", err);
          setItinerary([]);
        }

        setError(null);
      } catch (err) {
        setError("An unexpected error occurred. Please try again later.");
        setOpenSnackbar(true);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (place && packageId) {
      fetchPackageData();
    }
  }, [place, packageId]);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Banner Skeleton */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={450}
          sx={{ mb: 4, borderRadius: "12px" }}
        />

        <Grid2 container spacing={4}>
          {/* Left Column Skeleton */}
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
            <Grid2 container spacing={2} sx={{ mb: 4 }}>
              {[1, 2, 3].map((index) => (
                <Grid2 size={{ xs: 12, sm: 4 }} key={index}>
                  <Skeleton variant="rectangular" width="100%" height={120} />
                </Grid2>
              ))}
            </Grid2>
            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 3 }} />

            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
            {[1, 2, 3, 4].map((index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={80}
                sx={{ mb: 2 }}
              />
            ))}
          </Grid2>

          {/* Right Column Skeleton */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" width="100%" height={400} />
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
          <Typography variant="body1" color="text.secondary" mb={4}>
            The requested package could not be found.
          </Typography>
          <Link href={`/national-tourism/${place}/trip-packages`}>
            <Button
              variant="contained"
              sx={{ bgcolor: "#B90C1C", "&:hover": { bgcolor: "#a00a18" } }}
            >
              Back to Packages
            </Button>
          </Link>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Snackbar for errors */}
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
          {error}
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
            packageData.image || `/assets/places/${packageData.destination}.jpg`
          }
          alt="Package Banner"
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
          <Link href={`/national-tourism/${place}/trip-packages`}>
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
              fontSize: { xs: "1.5rem", sm: "2.5rem", md: "3.5rem" },
              textTransform: "uppercase",
              fontStyle: "italic",
              fontWeight: "bold",
            }}
          >
            {packageData.title ||
              `${packageData.days} Days & ${packageData.nights} Nights`}
          </Typography>
        </Box>
      </Box>

      <Grid2 container spacing={4}>
        {/* Left Column - Package Details */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" fontWeight="bold" mb={2}>
              Package Details
            </Typography>

            {/* Quick Info Cards */}
            <Grid2 container spacing={2} sx={{ mb: 4 }}>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Card sx={{ p: 2, textAlign: "center" }}>
                  <AccessTimeIcon
                    sx={{ fontSize: 40, color: "#B90C1C", mb: 1 }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Duration
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {packageData.duration ||
                      `${packageData.days} Days & ${packageData.nights} Nights`}
                  </Typography>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Card sx={{ p: 2, textAlign: "center" }}>
                  <HotelIcon sx={{ fontSize: 40, color: "#B90C1C", mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Hotel
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {packageData.hotel || "Standard Hotel"}
                  </Typography>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Card sx={{ p: 2, textAlign: "center" }}>
                  <LocationOnIcon
                    sx={{ fontSize: 40, color: "#B90C1C", mb: 1 }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Nearby
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {packageData.nearby}
                  </Typography>
                </Card>
              </Grid2>
            </Grid2>

            {/* Package Description */}
            <Typography variant="h5" fontWeight="bold" mb={2}>
              About This Package
            </Typography>
            {/* Trip Overview content directly under About This Package */}
            {itinerary.length > 0 && (
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
                    __html: itinerary[0].overview,
                  }}
                />
              </Box>
            )}

            {/* Trip Details */}
            {itinerary.length > 0 && (
              <Box sx={{ mb: 4 }}>
                {/* Adventure Plan Section */}
                <Accordion title="Adventure Plan">
                  <Box
                    sx={{
                      "& h1": {
                        display: "none", // Hide the h1 since we have our own header
                      },
                      "& h2": {
                        fontSize: "1.3rem",
                        fontWeight: "bold",
                        color: "#B90C1C",
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
                      },
                    }}
                  >
                    <Typography
                      dangerouslySetInnerHTML={{
                        __html: itinerary[0].adventure_plan,
                      }}
                    />
                  </Box>
                </Accordion>

                {/* Inclusions Section */}
                <Accordion title="Inclusions">
                  <Box
                    sx={{
                      "& h1": { display: "none" },
                      "& p": {
                        mb: 1,
                        lineHeight: 1.6,
                        fontSize: "0.95rem",
                        listStyleType: "disc",
                        ml: 2,
                      },
                    }}
                  >
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      <Typography
                        dangerouslySetInnerHTML={{
                          __html: itinerary[0].inclusions,
                        }}
                      />
                    </Box>
                  </Box>
                </Accordion>

                {/* Exclusions Section */}
                <Accordion title="Exclusions">
                  <Box
                    sx={{
                      "& h1": { display: "none" },
                      "& p": {
                        mb: 1,
                        lineHeight: 1.6,
                        fontSize: "0.95rem",
                        listStyleType: "disc",
                        ml: 2,
                      },
                    }}
                  >
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      <Typography
                        dangerouslySetInnerHTML={{
                          __html: itinerary[0].exclusions,
                        }}
                      />
                    </Box>
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
                      dangerouslySetInnerHTML={{ __html: itinerary[0].terms }}
                    />
                  </Box>
                </Accordion>
              </Box>
            )}
          </Box>
        </Grid2>

        {/* Right Column - Booking Card */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h4" fontWeight="bold" color="#B90C1C" mb={2}>
              {packageData.price || "Contact for Price"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Per person (inclusive of all taxes)
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" fontWeight="bold" mb={2}>
              What&apos;s Included:
            </Typography>
            <Box sx={{ mb: 3 }}>
              {[
                "Accommodation",
                "Transportation",
                "Meals",
                "Guide",
                "Entry Tickets",
              ].map((item, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                  ✓ {item}
                </Typography>
              ))}
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
    </Container>
  );
}
