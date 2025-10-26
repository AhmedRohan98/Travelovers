"use client";

import { useState } from "react";
import Link from "next/link";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FilterListIcon from "@mui/icons-material/FilterList";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "next/image";

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
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4, md: 5 }, px: { xs: 2, sm: 3 } }}>
      {/* Banner */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 200, sm: 250, md: 300 },
          mb: 4,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Lazy loaded background image */}
        <Image
          src={
            category === "national-tourism"
              ? "/assets/countries/national_tourism_header.png"
              : category === "global-tourism"
              ? "/assets/global/global_banner.jpg"
              : "/assets/countries/countries_header.png"
          }
          alt="Banner"
          fill
          style={{ objectFit: "cover", zIndex: 0 }}
          loading="lazy"
          priority={false}
        />
        {/* Overlay and content here */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 1,
            borderRadius: "12px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: { xs: "5%", sm: "10%" },
            transform: "translateY(-50%)",
            color: "white",
            zIndex: 2,
          }}
        >
          <Typography 
            variant="h3" 
            fontWeight="bold"
            sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
          >
            {category === "national-tourism"
              ? "National Tourism"
              : category === "global-tourism"
              ? "Global Tourism"
              : "Countries"}
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" sx={{ color: "white", fontSize: { xs: "0.75rem", sm: "1rem" } }}>
            <Link href="/" passHref>
              Home
            </Link>
            <Typography color="white">
              {category === "national-tourism"
                ? "National Tourism"
                : category === "global-tourism"
                ? "Global Tourism"
                : "Countries"}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* Mobile Filter Dropdown */}
      <Box sx={{ display: { xs: "block", sm: "none" }, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="mobile-filter-label">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FilterListIcon />
              Filter by Category
            </Box>
          </InputLabel>
          <Select
            labelId="mobile-filter-label"
            value={selectedFilter}
            label="Filter by Category"
            onChange={(e) => setSelectedFilter(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e0e0e0",
              },
            }}
          >
            {filters.map((filter) => (
              <MenuItem key={filter} value={filter}>
                {filter}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box display="flex" gap={4}>
        {/* Desktop Sidebar Filter */}
        <Box
          flexShrink={0}
          width={{ sm: 220, md: 250 }}
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
        <Grid container spacing={2} flex={1} sx={{ width: "100%" }}>
          {filteredLocations.map((loc) => {
            const isSelected = selectedLocation === loc.name;
            const href =
              category === "national-tourism"
                ? `/national-tourism/${loc.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}/trip-packages`
                : category === "global-tourism"
                ? `/global-tourism/${loc.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}/trip-packages`
                : `/${category}/${loc.name.toLowerCase().replace(/\s+/g, "-")}`;

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={loc.name}>
                <Link
                  href={href}
                  onClick={() => setSelectedLocation(loc.name)}
                  style={{ textDecoration: "none" }}
                >
                  {category === "national-tourism" ||
                  category === "global-tourism" ? (
                    <Card
                      sx={{
                        borderRadius: 4,
                        border: isSelected
                          ? "1px solid #B90C17"
                          : "1px solid #e0e0e0",
                        overflow: "hidden",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Box
                        component="img"
                        src={loc.imageUrl}
                        alt={loc.name}
                        loading="lazy"
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
                          ? "1px solid #B90C17"
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
