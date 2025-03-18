"use client";

import { Box, Button, Paper, Typography, Divider } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const carouselImages = [
  "/assets/hero1.jpg",
  "/assets/hero2.jpg",
  "/assets/hero3.jpg",
  "/assets/hero4.jpg",
  "/assets/hero5.jpg",
];

export function Hero() {
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
        <Typography variant="h1" style={{ marginBottom: "20px" }}>
          Journey with Confidence
          <br />
          <span style={{ color: "#779431" }}>Migrate</span> with Us
        </Typography>
        <Typography variant="body1" style={{ width: "60%", margin: "0 auto" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet
          arcu nunc. Duis egestas ac ante sed tincidunt.
        </Typography>
      </Box>

      {/* Quick Bar */}
      <HeroQuickBar />
    </Box>
  );
}

/** Quick Bar Component */
const HeroQuickBar = () => {
  return (
    <Box sx={styles.quickBar}>
      <Box sx={styles.quickBarContent}>
        <HeroQuickBarItem icon={<LocationOnIcon />} label="WHERE TO?" />
        <Divider orientation="vertical" flexItem sx={styles.divider} />
        <HeroQuickBarItem icon={<TravelExploreIcon />} label="TRAVEL TYPE" />
        <Divider orientation="vertical" flexItem sx={styles.divider} />
        <HeroQuickBarItem icon={<CalendarMonthIcon />} label="MONTH" />
      </Box>

      {/* FIND NOW Button */}
      <Button variant="contained" color="secondary" sx={styles.findNowButton}>
        FIND NOW
      </Button>
    </Box>
  );
};

/** Quick Bar Item */
const HeroQuickBarItem = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    {icon}
    <Typography sx={{ color: "white" }}>{label}</Typography>
  </Box>
);

/** Styles */
const styles = {
  container: {
    position: "relative",
    width: "100%",
    height: "90vh",
    overflow: "hidden",
  },
  carouselImage: {
    height: "80vh",
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
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    color: "white",
    zIndex: 2,
  },
  quickBar: {
    position: "absolute",
    bottom: "25px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "60%",
    height: "100px",
    background: "#6D8821",
    borderRadius: "50px",
    padding: "15px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
    border: "4px solid #EDEDED",
  },
  quickBarContent: {
    display: "flex",
    gap: "60px",
    marginLeft: "20px",
    flex: 1,
    height: "100%",
  },
  divider: {
    borderColor: "white",
  },
  findNowButton: {
    borderRadius: "0px 50px 50px 0px",
    padding: "15px 40px",
    fontWeight: "bold",
    fontSize: "16px",
    minHeight: "92px",
    position: "absolute",
    right: 0,
    top: 0,
    boxShadow: "none",
  },
};
