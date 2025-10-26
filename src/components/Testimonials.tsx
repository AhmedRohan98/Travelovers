"use client";

import React, { useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Box, Typography, IconButton } from "@mui/material";
import { Star, ArrowBack, ArrowForward } from "@mui/icons-material";

const testimonials = [
  {
    text: "It was a wonderful experience with Travelovers! Their team was professional, supportive, and guided me through every step of my student visa process, ensuring everything was smooth and hassle-free. I truly appreciate their dedication and highly recommend their services!",
    name: "Rohan Ishtiaq",
    role: "Student",
    rating: 5,
  },

  {
    text: "I can't thank Travelovers Visa enough for their exceptional service. They handled my visit visa application with utmost professionalism and efficiency. I received my visa without any hassles. Highly recommended!",
    name: "Amna Jutt",
    role: "CEO, StartupX",
    rating: 5,
  },
  {
    text: "It was a wonderful experience with travelovers. Their teams was professional, supportive and guided me in every steps of my student visa process. I truly appreciate their dedications and highly recomended their services.",
    name: "Hashoo Khan",
    role: "Student",
    rating: 5,
  },
  {
    text: "I recently used Travelovers for visa consulting services, and I was really impressed with the quality of their services. Their approach was very professional and efficient. They guided me at every step and provided all the necessary information in a clear and detailed manner. If you're looking for visa-related services, I highly recommend reaching out to Travelovers. You'll get excellent services, just like I did. Highly recommended.",
    name: "Fouzia Abbasi",
    role: "Traveler ",
    rating: 5,
  },
  {
    text: "Travelovers is awesome! They help with visas and make everything super easy, and I've seen how much they care about their clients. If you need a visa, this is the best place to go! Highly recommend!",
    name: "Inaya Noor",
    role: "Student",
    rating: 5,
  },
];

const TestimonialsCarousel = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveStep(
      (prevStep) =>
        (prevStep - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <Box sx={{ textAlign: "center", width: { xs: "95%", md: "80%" }, mx: "auto", p: 4, my: 4 }}>
      <Box sx={{ textAlign: "start", mb: 3 }}>
        <Typography variant="h6" color="textSecondary" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
          TESTIMONIALS
        </Typography>
        <Typography variant="h4" fontWeight={700} color="maroon" gutterBottom sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
          Some Valuable Insights from Customers
        </Typography>
      </Box>

      <Box sx={{ position: "relative" }}>
        <Carousel
          index={activeStep}
          indicators={false}
          duration={1000}
          animation="slide"
          navButtonsAlwaysInvisible
        >
          {testimonials.map((item, index) => (
            <Box
              key={index}
              sx={{ 
                display: "flex", 
                justifyContent: "center",
                px: { xs: 1, md: 2 }
              }}
            >
              <Paper
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 2,
                  boxShadow: 3,
                  width: { xs: "100%", sm: "90%", md: "85%" },
                  textAlign: "start",
                  maxWidth: "800px",
                }}
              >
                <Box sx={{ display: "flex", mb: 2 }}>
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} sx={{ color: "gold", fontSize: { xs: "1.25rem", md: "1.5rem" } }} />
                  ))}
                </Box>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    lineHeight: 1.6,
                    mb: 2
                  }}
                >
                  &ldquo;{item.text}&rdquo;
                </Typography>
                <Box>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    fontWeight={600}
                    sx={{ fontSize: { xs: "0.95rem", md: "1.125rem" } }}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
                    {item.role}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          ))}
        </Carousel>

        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 2, md: 3 } }}>
          <IconButton
            onClick={handlePrev}
            sx={{ 
              bgcolor: "#004d40", 
              color: "white", 
              m: 1,
              "&:hover": { bgcolor: "#00695c" }
            }}
          >
            <ArrowBack />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{ 
              bgcolor: "#b71c1c", 
              color: "white", 
              m: 1,
              "&:hover": { bgcolor: "#c62828" }
            }}
          >
            <ArrowForward />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default TestimonialsCarousel;
