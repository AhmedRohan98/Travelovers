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

export interface TouristPlace {
  name: string;
  imageUrl: string;
  region: string;
}

type CommonLocation = {
  name: string;
  imageUrl: string;
  category: string;
};

export default function Countries({
  countries = [],
  touristPlaces = [],
  category,
}: {
  countries?: Country[];
  touristPlaces?: TouristPlace[];
  category: string;
}) {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Normalize data into common structure
  const locations: CommonLocation[] =
    category === "national-tourism"
      ? touristPlaces.map((place) => ({
          name: place.name,
          imageUrl: place.imageUrl,
          category: place.region,
        }))
      : countries.map((country) => ({
          name: country.name,
          imageUrl: country.flag,
          category: country.continent,
        }));

  const filters = [
    "All",
    ...Array.from(new Set(locations.map((loc) => loc.category))),
  ];

  const filteredLocations =
    selectedFilter === "All"
      ? locations
      : locations.filter((loc) => loc.category === selectedFilter);

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
            {category === "national-tourism" ? "Tourist Places" : "Countries"}
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" sx={{ color: "white" }}>
            <Link href="/" passHref>
              Home
            </Link>
            <Typography color="white">
              {category === "national-tourism" ? "Places" : "Countries"}
            </Typography>
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
        {/* Sidebar Filter */}
        <Box
          flexShrink={0}
          width={250}
          bgcolor="white"
          borderRadius={2}
          sx={{
            height: "fit-content",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e0e0e0",
            overflow: "hidden",
            display: { xs: "none", sm: "block" },
          }}
        >
          <List>
            {filters.map((filter) => (
              <ListItemButton
                key={filter}
                selected={selectedFilter === filter}
                onClick={() => setSelectedFilter(filter)}
                sx={{
                  borderBottom: "1px solid #e0e0e0",
                  color: "black",
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontWeight:
                          selectedFilter === filter ? "bold" : "normal",
                        color: selectedFilter === filter ? "red" : "inherit",
                      }}
                    >
                      {filter}
                    </Typography>
                  }
                />
                <KeyboardArrowRightIcon />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Cards */}
        <Grid container spacing={2} flex={3}>
          {filteredLocations.map((loc) => {
            const isSelected = selectedLocation === loc.name;
            const href = `/${category}/${loc.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`;

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={loc.name}>
                <Link
                  href={href}
                  onClick={() => setSelectedLocation(loc.name)}
                  style={{ textDecoration: "none" }}
                >
                  {category === "national-tourism" ? (
                    <Card
                      sx={{
                        borderRadius: 4,
                        border: isSelected
                          ? "2px solid red"
                          : "1px solid #e0e0e0",
                        overflow: "hidden",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Box
                        component="img"
                        src={loc.imageUrl}
                        alt={loc.name}
                        sx={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                        }}
                      />
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color="text.primary"
                          align="center"
                        >
                          {loc.name.replace("-", " ")}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          align="center"
                        >
                          {loc.category}
                        </Typography>
                      </CardContent>
                    </Card>
                  ) : (
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
                        src={loc.imageUrl}
                        alt={loc.name}
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
                          {loc.name.replace("-", " ")}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
}
