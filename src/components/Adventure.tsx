"use client";
import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import { GenericTabs } from "./Tabs";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/navigation";

export type TabKey = "Road_to_Adventure" | "Study_Abroad" | "Travel_With_Us";

const tabSections = {
  Road_to_Adventure: [
    {
      src: "/assets/places/neelum-valley.jpg",
      title: "Neelum Valley",
      route: "/national-tourism/neelum-valley/trip-packages",
    },
    {
      src: "/assets/places/swat-valley.jpg",
      title: "Swat Valley",
      route: "/national-tourism/swat-valley/trip-packages",
    },
    {
      src: "/assets/places/kumrat.jpg",
      title: "Kumrat",
      route: "/national-tourism/kumrat/trip-packages",
    },
    {
      src: "/assets/places/naran.jpg",
      title: "Naran",
      route: "/national-tourism/naran/trip-packages",
    },
    {
      src: "/assets/places/gilgit.jpg",
      title: "Gilgit",
      route: "/national-tourism/gilgit/trip-packages",
    },
    {
      src: "/assets/places/fairy-meadow.jpg",
      title: "Fairy Meadows",
      route: "/national-tourism/fairy-meadows/trip-packages",
    },
  ],
  Study_Abroad: [
    {
      src: "/assets/countries/visit/place/united-kingdom.jpg",
      title: "United Kingdom",
      route: "/study/united-kingdom",
    },
    {
      src: "/assets/countries/visit/place/cyprus.jpg",
      title: "Cyprus",
      route: "/study/cyprus",
    },
    {
      src: "/assets/countries/visit/place/australia.jpg",
      title: "Australia",
      route: "/study/australia",
    },
    {
      src: "/assets/countries/visit/place/italy.jpg",
      title: "Italy",
      route: "/study/italy",
    },
    {
      src: "/assets/countries/visit/place/france.jpg",
      title: "France",
      route: "/study/france",
    },
    {
      src: "/assets/countries/visit/place/usa.jpg",
      title: "USA",
      route: "/study/usa",
    },
  ],
  Travel_With_Us: [
    {
      src: "/assets/global/baku.jpg",
      title: "Baku",
      route: "/global-tourism/baku/trip-packages",
    },
    {
      src: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Turkey",
      route: "/global-tourism/turkey/trip-packages",
    },
    {
      src: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Singapore",
      route: "/global-tourism/singapore/trip-packages",
    },
    {
      src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Dubai",
      route: "/global-tourism/dubai/trip-packages",
    },
    {
      src: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Thailand",
      route: "/global-tourism/thailand/trip-packages",
    },
    {
      src: "https://images.unsplash.com/photo-1534329539061-64caeb388c42?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Malaysia",
      route: "/global-tourism/malaysia/trip-packages",
    },
  ],
};

const TabContentSection = ({ activeTab }: { activeTab: TabKey }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const router = useRouter();
  const images = tabSections[activeTab];

  const handleDestinationClick = (route: string) => {
    router.push(route);
  };

  // Determine the number of columns based on screen size
  const getColumnCount = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 600) return 1; // Mobile
      if (window.innerWidth < 900) return 2; // Tablet
      return 3; // Desktop
    }
    return 3; // Default to 3 columns
  };

  // Calculate rows based on column count
  const columnCount = getColumnCount();
  const rows = Math.ceil(images.length / columnCount);

  return (
    <Box sx={{ width: "90%", margin: "auto", paddingY: 4 }}>
      {[...Array(rows)].map((_, row) => (
        <Grid
          key={row}
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: columnCount, sm: columnCount, md: columnCount }}
          sx={{ marginBottom: 2 }}
        >
          {images
            .slice(row * columnCount, (row + 1) * columnCount)
            .map((image, index) => {
              const actualIndex = row * columnCount + index;

              return (
                <Grid
                  key={actualIndex}
                  size={{xs: 1}}
                  sx={{
                    display: "flex",
                    flex:
                      hoveredRow === row
                        ? hoveredIndex === actualIndex
                          ? { xs: "2", sm: "4" } 
                          : "1"
                        : "1",
                    transition: "flex 0.3s ease-in-out",
                  }}
                >
                  <Paper
                    onMouseEnter={() => {
                      setHoveredIndex(actualIndex);
                      setHoveredRow(row);
                    }}
                    onMouseLeave={() => {
                      setHoveredIndex(null);
                      setHoveredRow(null);
                    }}
                    onClick={() => handleDestinationClick(image.route)}
                    sx={{
                      position: "relative",
                      width: "100%",
                      backgroundImage: `url(${image.src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      color: "white",
                      p: 2,
                      fontWeight: "bold",
                      textShadow: "0px 0px 10px rgba(0,0,0,0.7)",
                      height: {
                        xs: "200px",
                        sm: "250px",
                      },
                      ...(hoveredIndex === actualIndex && {
                        height: {
                          xs: "300px",
                          sm: "250px",
                        },
                      }),
                      transition:
                        "height 0.3s ease-in-out, flex 0.3s ease-in-out",
                      cursor: "pointer",
                    }}
                  >
                    {image.title}
                    {hoveredIndex === actualIndex && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0, 0, 0, 0.3)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease-in-out",
                        }}
                      >
                        {image.title}
                      </Box>
                    )}
                  </Paper>
                </Grid>
              );
            })}
        </Grid>
      ))}
    </Box>
  );
};

const Adventure = () => {
  const [selectedTab, setSelectedTab] = useState<TabKey>("Road_to_Adventure");

  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        p: 3,
      }}
    >
      <GenericTabs
        tabs={[
          { value: "Road_to_Adventure", label: "Road to Adventure" },
          { value: "Study_Abroad", label: "Study Abroad" },
          { value: "Travel_With_Us", label: "Travel With Us" },
        ]}
        defaultValue="Road_to_Adventure"
        onChange={(value) => setSelectedTab(value)}
      />

      <TabContentSection activeTab={selectedTab} />
    </Box>
  );
};

export default Adventure;
