"use client";

import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";

const WhyChooseUs = () => {
  const counters = [
    { label: "Happy Clients", target: 300 },
    { label: "Successful Trips", target: 1200 },
    { label: "Destinations Covered", target: 80 },
  ];

  return (
    <Box
      sx={{
        width: "80%",
        background: "linear-gradient(to right, #6D0019, #B7001F)",
        borderRadius: "50px",
        color: "white",
        textAlign: "center",
        padding: "40px 20px",
        margin: "50px auto",
      }}
    >
      {/* Heading */}
      <Typography variant="h1" fontWeight="bold">
        WHY CHOOSE US?
      </Typography>

      {/* Counter Stats */}
      <Stack direction="row" spacing={2} justifyContent="space-evenly" mt={3}>
        {counters.map((counter, index) => (
          <Stack key={index} textAlign="center">
            <AnimatedCounter target={counter.target} />
            <Typography variant="body1" mt={1}>
              {counter.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

const AnimatedCounter = ({ target }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = target / 200;
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
    <Typography variant="h3" fontWeight="bold">
      {count.toLocaleString()}+
    </Typography>
  );
};

export default WhyChooseUs;
