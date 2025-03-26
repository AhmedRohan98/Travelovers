"use client";
import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import { GenericTabs } from "./Tabs";
import Grid from "@mui/material/Grid2";

export type TabKey = "Road_to_Adventure" | "Study_Abroad" | "Travel_With_Us";

const tabSections = {
  Road_to_Adventure: [
    {
      src: "https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Asia",
    },
    {
      src: "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "South America",
    },
    {
      src: "https://images.unsplash.com/photo-1515451061725-639f7e2893a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "North America",
    },
    {
      src: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=2130&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Australia",
    },
    {
      src: "https://images.unsplash.com/photo-1608817576203-3c27ed168bd2?q=80&w=1984&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Europe",
    },
    {
      src: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Africa",
    },
  ],
  Study_Abroad: [
    {
      src: "https://images.unsplash.com/photo-1622397333309-3056849bc70b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Harvard",
    },
    {
      src: "https://images.unsplash.com/photo-1579628151787-e17a97e79feb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Oxford",
    },
    {
      src: "https://images.unsplash.com/photo-1619139079319-ba9ff149a8c2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Stanford",
    },
  ],
  Travel_With_Us: [
    {
      src: "https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Paris",
    },
    {
      src: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "London",
    },
    {
      src: "https://plus.unsplash.com/premium_photo-1661914240950-b0124f20a5c1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Tokyo",
    },
  ],
};

const TabContentSection = ({ activeTab }: { activeTab: TabKey }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const images = tabSections[activeTab];

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
