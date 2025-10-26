"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HotelIcon from "@mui/icons-material/Hotel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";
import { supabase } from "@/lib/supabase/server";

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

export default function TripPackagesPage() {
  const { place } = useParams();
  const router = useRouter();
  const [packages, setPackages] = useState<TripPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchTripPackages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("trips")
          .select("*")
          .eq("destination", place)
          .order("trip_id", { ascending: true });

        if (error) {
          setError("Failed to fetch trip packages. Please try again later.");
          setOpenSnackbar(true);
          console.error("Supabase error:", error);
        } else if (!data || data.length === 0) {
          setError("No trip packages found for this destination.");
          setOpenSnackbar(true);
        } else {
          setPackages(data);
          setError(null);
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again later.");
        setOpenSnackbar(true);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (place) {
      fetchTripPackages();
    }
  }, [place]);

  const heroImage = packages[0]?.image || `/assets/places/${place}.jpg`;

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

        {/* Cards Skeleton */}
        <Grid container spacing={4}>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: "100%" }}>
                <Skeleton variant="rectangular" width="100%" height={180} />
                <CardContent>
                  <Skeleton variant="text" width="80%" height={32} />
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={40}
                    sx={{ mt: 2 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (!packages || packages.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h4" color="text.secondary" mb={2}>
            No trip packages found
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            We couldn&apos;t find any trip packages for this destination.
          </Typography>
          <Link href="/national-tourism">
            <Button
              variant="contained"
              sx={{ bgcolor: "#B90C1C", "&:hover": { bgcolor: "#a00a18" } }}
            >
              Back to National Tourism
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
        {/* Back Button - Top Right Corner */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: 16, md: 20 },
            right: { xs: 16, md: 20 },
            zIndex: 3,
          }}
        >
          <Link href="/national-tourism">
            <ArrowBackIosIcon
              sx={{
                color: "white",
                fontSize: { xs: "1.5rem", md: "2rem" },
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                p: 1,
                cursor: "pointer",
                "&:hover": {
                  color: "#660D17",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                },
                transition: "all 0.3s",
              }}
            />
          </Link>
        </Box>

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
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 2,
            textAlign: "left",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2.5rem", md: "3rem" },
              textTransform: "uppercase",
              fontStyle: "italic",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.2,
              maxWidth: "100%",
            }}
          >
            <span
              style={{
                background: "linear-gradient(45deg, white, #B90C17)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {typeof place === "string" ? place.replace(/-/g, " ") : ""}
            </span>
          </Typography>
        </Box>
      </Box>

      {/* Trip Packages Grid */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.8rem", md: "2.5rem" },
            fontWeight: "bold",
            mb: 4,
            textAlign: "center",
            color: "#B90C1C",
          }}
        >
          Available Trip Packages
        </Typography>
        <Grid container spacing={4}>
          {packages.map((pkg) => (
            <Grid item xs={12} sm={6} md={4} key={pkg.trip_id}>
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
                    src={pkg.image || `/assets/places/${pkg.destination}.jpg`}
                    alt={pkg.title || `${pkg.destination} Package`}
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
                    <Typography variant="h6" fontWeight="bold" mb={1}
                    sx={{
                        color: "#1E293B",
                        textAlign: "center",
                        borderBottom: "3px solid #B90C1C",
                        display: "inline-block",
                        paddingBottom: "2px",
                      }}>
                      {pkg.title || `${pkg.days} Days ${pkg.nights} Nights`}
                    </Typography>
                    
                    {/* Mobile: Price before details, Desktop: Price after details */}
                    <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="#B90C1C"
                        sx={{ textAlign: "center" }}
                      >
                        {pkg.price || "Contact for Price"}
                      </Typography>
                    </Box>
                    
                    <Box
                      component="ul"
                      sx={{
                        pl: 2,
                        mb: 2,
                        color: "text.secondary",
                        fontSize: 15,
                      }}
                    >
                      <li>
                        <AccessTimeIcon
                          sx={{
                            fontSize: 16,
                            mr: 0.5,
                            verticalAlign: "middle",
                          }}
                        />{" "}
                        Duration: {pkg.duration || `${pkg.days} Days`}
                      </li>
                      <li>
                        {" "}
                        <HotelIcon
                          sx={{
                            fontSize: 16,
                            mr: 0.5,
                            verticalAlign: "middle",
                          }}
                        />{" "}
                        Hotel: {pkg.hotel || "Standard"}
                      </li>
                      <li>
                        <LocationOnIcon
                          sx={{
                            fontSize: 16,
                            mr: 0.5,
                            verticalAlign: "middle",
                          }}
                        />{" "}
                        Top Attractions: {pkg.nearby}
                      </li>
                    </Box>
                    
                    {/* Desktop: Price after details */}
                    <Box sx={{ display: { xs: "none", md: "block" } }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="#B90C1C"
                        mb={2}
                        sx={{ textAlign: "right" }}
                      >
                        {pkg.price || "Contact for Price"}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() =>
                      router.push(
                        `/national-tourism/${place}/trip-packages/${pkg.trip_id}`
                      )
                    }
                    sx={{
                      mt: "auto",
                      width: "100%",
                      bgcolor: "#B90C1C",
                      color: "white",
                      borderRadius: 1,
                      fontWeight: 600,
                      py: 1.5,
                      "&:hover": { bgcolor: "#a00a18" },
                    }}
                  >
                    View Details
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
