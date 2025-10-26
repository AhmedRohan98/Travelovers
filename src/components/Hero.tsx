"use client";

import { 
  Box, 
  Button, 
  Paper, 
  Typography, 
  Modal, 
  Card, 
  CardContent, 
  Grid,
  Avatar,
  Chip,
  CircularProgress,
  Backdrop
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCountriesByCategoryAsync } from "@/lib/data/countries";
import { Country, TouristPlace } from "@/components/Countries";

const carouselImages = [
  "/assets/hero1.jpg",
  "/assets/hero2.jpg",
  "/assets/hero3.jpg",
  "/assets/hero4.jpg",
  "/assets/hero5.jpg",
];

const Hero = () => {
  return (
    <Box sx={styles.container}>
      {/* Background Carousel */}
      <Carousel indicators={false} duration={1000} animation="slide">
        {carouselImages.map((image, index) => (
          <Paper
            key={index}
            sx={{ ...styles.carouselImage, backgroundImage: `url(${image})` }}
          >
            <Box sx={styles.overlay} />
          </Paper>
        ))}
      </Carousel>

      {/* Hero Text */}
      <Box sx={styles.heroText}>
        <Typography 
          variant="h2" 
          sx={{ 
            marginBottom: "20px",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem" },
            px: { xs: 2, sm: 3, md: 0 }
          }}
        >
          Need help with your <span style={{ color: "#D30000" }}>Visa Application?</span>
          <br />
          <span style={{ color: "#779431" }}>You&apos;re</span> In The Right Place
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" }, 
            margin: "0 auto",
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
            px: { xs: 2, sm: 0 }
          }}
        >
          From your first question to your dream destination, we simplify the process, handle every detail, and guide you every step of the way — so you can focus on your trip while we strengthen your visa application.
        </Typography>
      </Box>

      {/* Quick Bar */}
      <HeroQuickBar />
    </Box>
  );
};

/** Quick Bar Component */
const HeroQuickBar = () => {
  const [travelTypeModalOpen, setTravelTypeModalOpen] = useState(false);
  const [destinationModalOpen, setDestinationModalOpen] = useState(false);
  const [selectedTravelType, setSelectedTravelType] = useState<string>("");
  const [destinations, setDestinations] = useState<(Country | TouristPlace)[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const travelTypes = [
    { 
      value: "visit", 
      label: "Visit/Visa", 
      icon: "🌍", 
      description: "Explore visa requirements and travel information" 
    },
    { 
      value: "study", 
      label: "Study", 
      icon: "🎓", 
      description: "Find study opportunities abroad" 
    },
    { 
      value: "national-tourism", 
      label: "National Tourism", 
      icon: "🏔️", 
      description: "Discover beautiful places in Pakistan" 
    },
    { 
      value: "global-tourism", 
      label: "Global Tourism", 
      icon: "✈️", 
      description: "Explore international destinations" 
    }
  ];

  // Helper function to generate route based on category and destination name
  const generateRoute = (category: string, destinationName: string): string => {
    const slug = destinationName.toLowerCase().replace(/\s+/g, '-');
    
    if (category === "national-tourism" || category === "global-tourism") {
      return `/${category}/${slug}/trip-packages`;
    } else {
      return `/${category}/${slug}`;
    }
  };

  // Load destinations when travel type is selected
  useEffect(() => {
    if (selectedTravelType) {
      setLoading(true);
      
      // Fetch all destinations from database for any category
      getCountriesByCategoryAsync(selectedTravelType)
        .then((data) => {
          setDestinations(data);
        })
        .catch((error) => {
          console.error("Error loading destinations:", error);
          setDestinations([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedTravelType]);

  const handleTravelTypeSelect = (travelType: string) => {
    setSelectedTravelType(travelType);
    setTravelTypeModalOpen(false);
    setDestinationModalOpen(true);
  };

  const handleDestinationSelect = (destination: string) => {
    // Generate route based on category and destination name
    const route = generateRoute(selectedTravelType, destination);
    router.push(route);
    setDestinationModalOpen(false);
    // Reset state
    setSelectedTravelType("");
    setDestinations([]);
  };

  const handleTravelTypeModalOpen = () => {
    setTravelTypeModalOpen(true);
    setSelectedTravelType("");
    setDestinations([]);
  };

  const handleTravelTypeModalClose = () => {
    setTravelTypeModalOpen(false);
    setSelectedTravelType("");
    setDestinations([]);
  };

  const handleDestinationModalClose = () => {
    setDestinationModalOpen(false);
    setSelectedTravelType("");
    setDestinations([]);
  };

  return (
    <>
      <Box sx={styles.quickBar}>
        <Button 
          variant="contained" 
          color="secondary" 
          sx={styles.searchButton}
          onClick={handleTravelTypeModalOpen}
          >
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" }, fontWeight: "bold" }}>
            Start Your Adventure
          </Typography>
        </Button>
        <Link href="/visa-assessment" style={{ textDecoration: 'none' }}>
          <Button 
            variant="contained" 
            color="primary" 
            sx={styles.visaButton}
            >
            <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" }, fontWeight: "bold" }}>
              Check Visa Chances
            </Typography>
          </Button>
        </Link>
      </Box>

      {/* Travel Type Selection Modal */}
      <Modal
        open={travelTypeModalOpen}
        onClose={handleTravelTypeModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box sx={styles.modalContainer}>
          <Card sx={styles.modalCard}>
            <Box sx={styles.modalHeader}>
              <Typography variant="h4" sx={styles.modalTitle}>
                Choose Travel Type
              </Typography>
              <Button onClick={handleTravelTypeModalClose} sx={styles.closeButton}>
                <CloseIcon />
              </Button>
            </Box>

            <CardContent sx={styles.modalContent}>
              <Grid container spacing={3}>
                {travelTypes.map((type) => (
                  <Grid item xs={12} sm={6} key={type.value}>
                    <Card
                      sx={styles.typeCard}
                      onClick={() => handleTravelTypeSelect(type.value)}
                    >
                      <CardContent sx={styles.typeCardContent}>
                        <Typography variant="h3" sx={styles.typeIcon}>
                          {type.icon}
                        </Typography>
                        <Typography variant="h6" sx={styles.typeLabel}>
                          {type.label}
                        </Typography>
                        <Typography variant="body2" sx={styles.typeDescription}>
                          {type.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Modal>

      {/* Destination Selection Modal */}
      <Modal
        open={destinationModalOpen}
        onClose={handleDestinationModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box sx={styles.modalContainer}>
          <Card sx={styles.modalCard}>
            <Box sx={styles.modalHeader}>
              <Typography variant="h4" sx={styles.modalTitle}>
                Choose Destination
              </Typography>
              <Button onClick={handleDestinationModalClose} sx={styles.closeButton}>
                <CloseIcon />
              </Button>
            </Box>

            <CardContent sx={styles.modalContent}>
              {loading ? (
                <Box sx={styles.loadingContainer}>
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading destinations...
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2} justifyContent="center">
                  {destinations.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                      <Card
                        sx={styles.destinationCard}
                        onClick={() => handleDestinationSelect(item.name)}
                      >
                        <CardContent sx={styles.destinationCardContent}>
                          <Avatar
                            sx={styles.destinationAvatar}
                            src={'flag' in item ? item.flag : item.imageUrl}
                          >
                            {item.name.charAt(0)}
                          </Avatar>
                          <Typography variant="subtitle1" sx={styles.destinationName}>
                            {item.name.replace("-", " ")}
                          </Typography>
                          {('continent' in item ? item.continent : item.region) && (
                            <Chip 
                              label={'continent' in item ? item.continent : item.region} 
                              size="small" 
                              sx={styles.continentChip}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </>
  );
};


/** Styles */
const styles = {
  container: {
    position: "relative",
    width: "100%",
    height: { xs: "70vh", sm: "80vh", md: "90vh" },
    overflow: "hidden",
  },
  carouselImage: {
    height: { xs: "70vh", sm: "80vh", md: "90vh" },
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  heroText: {
    position: "absolute",
    top: { xs: "35%", sm: "40%" },
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    color: "white",
    zIndex: 2,
    width: "100%",
  },

  quickBar: {
    position: "absolute",
    bottom: { xs: "15px", sm: "20px", md: "25px" },
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    gap: { xs: "10px", sm: "15px", md: "20px" },
    width: { xs: "90%", sm: "auto" },
    animation: "jump 3s infinite",
    "@keyframes jump": {
      "0%, 100%": {
        transform: "translateX(-50%) translateY(0)", // start + end at ground
      },
      "5%": {
        transform: "translateX(-50%) translateY(-8px)", // hop up
      },
      "10%": {
        transform: "translateX(-50%) translateY(0)", // land
      },
      "15%": {
        transform: "translateX(-50%) translateY(-8px)", // hop up again
      },
      "20%": {
        transform: "translateX(-50%) translateY(0)", // land again
      },
    },
  },
  
  searchButton: {
    borderRadius: "50px",
    padding: { xs: "12px 24px", sm: "13px 30px", md: "15px 40px" },
    fontWeight: "bold",
    minHeight: { xs: "50px", sm: "55px", md: "60px" },
    width: { xs: "100%", sm: "auto" },
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    background: "linear-gradient(135deg, #B90C1C 0%, #dc2626 100%)",
    border: "3px solid #fff",
    "&:hover": {
      background: "linear-gradient(135deg, #a00a18 0%, #b91c1c 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
    },
    transition: "all 0.3s ease",
  },

  visaButton: {
    borderRadius: "50px",
    padding: { xs: "12px 24px", sm: "13px 30px", md: "15px 40px" },
    fontWeight: "bold",
    minHeight: { xs: "50px", sm: "55px", md: "60px" },
    width: { xs: "100%", sm: "auto" },
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
    border: "3px solid #fff",
    "&:hover": {
      background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
    },
    transition: "all 0.3s ease",
  },
  // Modal Styles
  modalContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95%", sm: "90%", md: "80%", lg: "70%" },
    maxWidth: "1000px",
    maxHeight: "90vh",
    outline: "none",
  },
  modalCard: {
    borderRadius: 3,
    boxShadow: "0 24px 48px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
  },
  modalHeader: {
    background: "linear-gradient(135deg, #B90C1C 0%, #dc2626 100%)",
    color: "white",
    p: 3,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: { xs: "1.5rem", sm: "2rem" },
  },
  closeButton: {
    color: "white",
    minWidth: "auto",
    p: 1,
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
  modalContent: {
    p: 3,
    maxHeight: "70vh",
    overflowY: "auto",
  },
  sectionContainer: {
    mb: 4,
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#B90C1C",
    mb: 3,
    fontSize: "1.25rem",
  },
  // Travel Type Card Styles
  typeCard: {
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "2px solid #e0e0e0",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
      borderColor: "#B90C1C",
    },
  },
  typeCardContent: {
    textAlign: "center",
    p: 3,
  },
  typeIcon: {
    mb: 2,
    fontSize: "3rem",
  },
  typeLabel: {
    fontWeight: "bold",
    color: "#B90C1C",
    mb: 1,
  },
  typeDescription: {
    color: "#666",
    fontSize: "0.9rem",
  },
  // Destination Card Styles
  destinationCard: {
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "2px solid #e0e0e0",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
      borderColor: "#B90C1C",
    },
  },
  destinationCardContent: {
    textAlign: "center",
    p: 1.5,
  },
  destinationAvatar: {
    width: 50,
    height: 50,
    mx: "auto",
    mb: 1.5,
    border: "3px solid #e0e0e0",
  },
  destinationName: {
    fontWeight: "bold",
    color: "#333",
    mb: 1,
  },
  continentChip: {
    backgroundColor: "#f0f0f0",
    color: "#666",
    fontSize: "0.75rem",
  },
  // Loading Styles
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    py: 4,
  },
};

export default Hero;
