"use client";

import { useEffect, useState } from "react";
import { Box, Stack, Typography, useTheme, useMediaQuery } from "@mui/material";

const WhyChooseUs = () => {
  const counters = [
    { label: "Happy Clients", target: 4000 },
    { label: "Professional Experience", target: 18 },
    { label: "Visa Ratio", target: 90 },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "80%",
        background: "linear-gradient(to right, #6D0019, #B7001F)",
        borderRadius: "50px",
        color: "white",
        textAlign: "center",
        padding: { xs: "30px 15px", sm: "40px 20px" },
        margin: { xs: "30px auto", sm: "50px auto" },
      }}
    >
      {/* Heading */}
      <Typography
        variant="h1"
        fontWeight="bold"
        sx={{
          fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
        }}
      >
        WHY CHOOSE US?
      </Typography>

      {/* Counter Stats */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 3, sm: 2 }}
        justifyContent="space-evenly"
        alignItems="center"
        mt={3}
      >
        {counters.map((counter, index) => (
          <Stack key={index} textAlign="center">
            <AnimatedCounter target={counter.target} />
            <Typography
              variant="body1"
              mt={1}
              sx={{
                fontSize: { xs: "1rem", sm: "1.2rem" },
              }}
            >
              {counter.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

const AnimatedCounter = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    let current = 0;
    const increment = target / 150;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        clearInterval(interval);
        setCount(target);
      } else {
        setCount(Math.ceil(current));
      }
    }, 20);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <Typography
      variant="h3"
      fontWeight="bold"
      sx={{
        fontSize: isSmallScreen ? "2rem" : "3rem",
      }}
    >
      {count.toLocaleString()}+
    </Typography>
  );
};

export default WhyChooseUs;
