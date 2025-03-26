"use client";

import React, { useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Box, Typography, IconButton } from "@mui/material";
import { Star, ArrowBack, ArrowForward } from "@mui/icons-material";

const testimonials = [
  {
    text: "This is an amazing product! I have been using it for a year and I love it.",
    name: "John Doe",
    role: "Accountant",
    rating: 5,
  },
  {
    text: "Excellent service and outstanding quality. Highly recommend!",
    name: "Jane Smith",
    role: "Marketing Manager",
    rating: 4,
  },
  {
    text: "One of the best investments I made. It has helped me a lot!",
    name: "Alice Brown",
    role: "CEO, StartupX",
    rating: 5,
  },
  {
    text: "This has truly made my workflow so much smoother. Thank you!",
    name: "Michael Lee",
    role: "Product Designer",
    rating: 4,
  },
  {
    text: "I appreciate the attention to detail and customer service.",
    name: "Sophia Wilson",
    role: "Freelancer",
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
