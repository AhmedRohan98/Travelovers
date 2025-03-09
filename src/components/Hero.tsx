"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Carousel from "react-material-ui-carousel";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Divider from "@mui/material/Divider";
import Image from "next/image";

export function Hero() {
  const carouselImages = [
    "/assets/hero1.jpg",
    "/assets/hero2.jpg",
    "/assets/hero3.jpg",
    "/assets/hero4.jpg",
    "/assets/hero5.jpg",
  ];

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "90vh",
        overflow: "hidden",
      }}
    >
      {/* Carousel Background */}
      <Carousel indicators={false} interval={10000} animation="slide">
        {carouselImages.map((image, index) => (
          <Paper
            key={index}
            sx={{
              height: "80vh",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundImage: `url(${image})`,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              }}
            />
          </Paper>
        ))}
      </Carousel>

      {/* Centered Text */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "white",
          zIndex: 2,
        }}
      >
        <Typography variant="h2" fontWeight="bold">
          Explore The World With Us
        </Typography>
        <Typography variant="h6">
          Find your perfect travel destination
        </Typography>
      </Box>

      {/* Quick Bar */}
      <Box
        sx={{
          position: "absolute",
          bottom: "25px",
          left: "50%",
          height: "100px",
          transform: "translateX(-50%)",
          width: "60%",
          background: "#6D8821",
          borderRadius: "50px",
          padding: "15px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          zIndex: 10,
          border: "4px solid #EDEDED",
        }}
      >
        {/* Where To? */}
        <Box
          sx={{
            display: "flex",
            gap: "60px",
            marginLeft: "20px",
            flex: 1,
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon sx={{ color: "white" }} />\
            <Typography sx={{ color: "white" }}>WHERE TO?</Typography>
          </Box>

          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ borderColor: "white" }}
          />

          {/* Travel Type */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TravelExploreIcon sx={{ color: "white" }} />
            <Typography sx={{ color: "white" }}>TRAVEL TYPE</Typography>
          </Box>

          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ borderColor: "white" }}
          />

          {/* Month */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarMonthIcon sx={{ color: "white" }} />
            <Typography sx={{ color: "white" }}>MONTH</Typography>
          </Box>
        </Box>

        {/* FIND NOW Button (Aligned Right) */}
        <Button
          variant="contained"
          sx={{
            background: "#660D17",
            borderRadius: "0px 50px 50px 0px",
            padding: "15px 40px",
            fontWeight: "bold",
            fontSize: "16px",
            textTransform: "uppercase",
            color: "white",
            minHeight: "92px",
            position: "absolute",
            right: 0,
            top: 0,
            "&:hover": {
              background: "#520A13",
            },
          }}
        >
          FIND NOW
        </Button>
      </Box>
    </Box>
  );
}
