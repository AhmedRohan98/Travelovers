"use client";
import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import { GenericTabs } from "./Tabs";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/navigation";

export type TabKey = "Explore_Pakistan" | "Study_Abroad" | "Explore_The_World";

const tabSections = {
  Explore_Pakistan: [
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
  Explore_The_World: [
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
  const router = useRouter();
  const images = tabSections[activeTab];

  const handleDestinationClick = (route: string) => {
    router.push(route);
  };

  return (
    <Box sx={{ width: { xs: "95%", md: "90%" }, margin: "auto", paddingY: { xs: 3, md: 4 } }}>
      <Grid 
        container 
        spacing={{ xs: 2, md: 3 }}
        sx={{
          justifyContent: "center"
        }}
      >
        {images.map((image, index) => (
          <Grid 
            key={index}
            size={{ xs: 12, sm: 6, md: 4 }}
            sx={{
              display: "flex",
            }}
          >
            <Paper
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
                height: { xs: "180px", sm: "220px", md: "250px" },
                transition: "all 0.3s ease-in-out",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                },
              }}
            >
              {image.title}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const Adventure = () => {
  const [selectedTab, setSelectedTab] = useState<TabKey>("Study_Abroad");

  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        p: { xs: 2, md: 3 },
        my: { xs: 3, md: 4 }
      }}
    >
      <GenericTabs
        tabs={[
          { value: "Study_Abroad", label: "Study Abroad" },
          { value: "Explore_Pakistan", label: "Explore Pakistan" },
          { value: "Explore_The_World", label: "Explore The World" },
        ]}
        defaultValue="Study_Abroad"
        onChange={(value) => setSelectedTab(value)}
      />

      <TabContentSection activeTab={selectedTab} />
    </Box>
  );
};

export default Adventure;
