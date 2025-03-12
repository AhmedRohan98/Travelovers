"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Image from "next/image";
import ForumIcon from "@mui/icons-material/Forum";

const pages = [
  "VISIT",
  "STUDY",
  "IMMIGRATION",
  "GLOBAL TOURISM",
  "NATIONAL TOURISM",
  "UMRAH",
];

export function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        borderBottom: "2px solid #ccc",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Image src="/travelogo.png" width={60} height={60} alt="Logo" />

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                sx={{ color: "#8B0000", fontWeight: "bold", mx: 2 }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Help Section */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ForumIcon sx={{ color: "#8B0000", mr: 1 }} />
            <Box>
              <Typography variant="body2" sx={{ color: "black" }}>
                Need help?
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#8B0000", fontWeight: "bold" }}
              >
                (307) 555-0133
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
