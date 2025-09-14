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
    text: "I recently used Travelovers for visa consulting services, and I was really impressed with the quality of their services. Their approach was very professional and efficient. They guided me at every step and provided all the necessary information in a clear and detailed manner. If you’re looking for visa-related services, I highly recommend reaching out to Travelovers. You’ll get excellent services, just like I did. Highly recommended.",
    name: "Fouzia Abbasi",
    role: "Traveler ",
    rating: 5,
  },
  {
    text: "Travelovers is awesome! They help with visas and make everything super easy, and I’ve seen how much they care about their clients. If you need a visa, this is the best place to go! Highly recommend!",
    name: "Inaya Noor",
    role: "Student",
    rating: 5,
  },
];

const chunkArray = (arr: typeof testimonials, size: number) => {
  return arr.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, [] as (typeof testimonials)[]);
};

const TestimonialsCarousel = () => {
  const groupedTestimonials = chunkArray(testimonials, 3);
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % groupedTestimonials.length);
  };

  const handlePrev = () => {
    setActiveStep(
      (prevStep) =>
        (prevStep - 1 + groupedTestimonials.length) % groupedTestimonials.length
    );
  };

  return (
    <Box sx={{ textAlign: "center", width: "80%", mx: "auto", p: 4, my: 4 }}>
      <Box sx={{ textAlign: "start" }}>
        <Typography variant="h6" color="textSecondary">
          TESTIMONIALS
        </Typography>
        <Typography variant="h4" fontWeight={700} color="maroon" gutterBottom>
          Some Valuable Insights from Customers
        </Typography>
      </Box>

      <Carousel
        index={activeStep}
        indicators={false}
        duration={1000}
        animation="slide"
        navButtonsAlwaysInvisible
      >
        {groupedTestimonials.map((group, index) => (
          <Box
            key={index}
            sx={{ display: "flex", gap: 2, justifyContent: "center" }}
          >
            {group.map((item, idx) => (
              <Paper
                key={idx}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 3,
                  width: "48%",
                  m: 2,
                  textAlign: "start",
                }}
              >
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {item.text}
                </Typography>
                <Box display="flex" justifyContent="start" mt={2}>
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} sx={{ color: "gold", fontSize: "1.5rem" }} />
                  ))}
                </Box>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight={600}
                  mt={2}
                >
                  {item.name}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {item.role}
                </Typography>
              </Paper>
            ))}
          </Box>
        ))}
      </Carousel>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <IconButton
          onClick={handlePrev}
          sx={{ bgcolor: "#004d40", color: "white", m: 1 }}
        >
          <ArrowBack />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{ bgcolor: "#b71c1c", color: "white", m: 1 }}
        >
          <ArrowForward />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TestimonialsCarousel;
