"use client";

import { useState } from "react";
import Link from "next/link";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Card,
  CardContent,
  Avatar,
  Breadcrumbs,
  Container,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

export type Country = {
  name: string;
  flag: string;
  continent: string;
};

export default function Countries({
  countries,
  category,
}: {
  countries: Country[];
  category: string;
}) {
  const [selectedContinent, setSelectedContinent] = useState<string>("All");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const continents = [
    "Asia",
    "Europe",
    "North America",
    "Australia",
    "Latine America",
    "Africa",
  ];

  const filteredCountries =
    selectedContinent === "All"
      ? countries
      : countries.filter((c) => c.continent === selectedContinent);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Banner */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 300,
          mb: 4,
          backgroundImage: "url('/assets/countries/countries_header.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "black",
          zIndex: 0,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Overlay Content */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "10%",
            transform: "translateY(-50%)",
            color: "white",
            zIndex: 2,
          }}
        >
          <Typography variant="h3" fontWeight="bold">
            Countries
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" sx={{ color: "white" }}>
            <Link href="/" passHref>
              Home
            </Link>
            <Typography color="white">Countries</Typography>
          </Breadcrumbs>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
            borderRadius: "12px",
          }}
        />
      </Box>

      <Box display="flex" gap={4}>
        {/* Sidebar */}
        <Box
          flexShrink={0}
          width={250}
          bgcolor="white"
          borderRadius={2}
          sx={{
            height: "fit-content",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            overflow: "hidden",
            display: { xs: "none", sm: "block" },
          }}
        >
          <List>
            {continents.map((continent) => (
              <ListItemButton
                key={continent}
                selected={selectedContinent === continent}
                onClick={() => setSelectedContinent(continent)}
                sx={{
                  borderBottom: "1px solid #e0e0e0",
                  color: "black"
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontWeight:
                          selectedContinent === continent ? "bold" : "normal",
                        color:
                          selectedContinent === continent ? "red" : "inherit",
                      }}
                    >
                      {continent}
                    </Typography>
                  }
                />
                <KeyboardArrowRightIcon />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Country Cards */}
        <Grid container spacing={2} flex={3}>
          {filteredCountries.length === 0 ? (
            <Grid size={{ xs: 12 }} textAlign="center" mt={4}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
              >
                <Avatar
                  sx={{
                    bgcolor: "transparent",
                    width: 80,
                    height: 80,
                  }}
                >
                  <SentimentVeryDissatisfiedIcon
                    sx={{ fontSize: 60, color: "#e0e0e0" }}
                  />
                </Avatar>
                <Typography variant="h6" color="textSecondary">
                  No countries found
                </Typography>
              </Box>
            </Grid>
          ) : (
            filteredCountries.map((country) => {
              const isSelected = selectedCountry === country.name;

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={country.name}>
                  <Link
                    href={`/countries/${category}/${country.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    onClick={() => setSelectedCountry(country.name)}
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        gap: 2,
                        border: isSelected
                          ? "2px solid red"
                          : "1px solid #e0e0e0",
                        transition: "all 0.2s ease",
                        boxShadow: "none",
                        borderRadius: 5,
                      }}
                    >
                      <Avatar
                        src={country.flag}
                        alt={country.name}
                        sx={{ width: 48, height: 48 }}
                      />
                      <CardContent
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignContent: "center",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="medium"
                          color="black"
                        >
                          {country.name.replace("-", " ")}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              );
            })
          )}
        </Grid>
      </Box>
    </Container>
  );
}
