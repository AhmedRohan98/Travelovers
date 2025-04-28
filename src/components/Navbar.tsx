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

import Link from "next/link";

const pages = [
  { name: "VISIT", path: "/visit" },
  { name: "STUDY", path: "/study" },
  { name: "IMMIGRATION", path: "/countries" },
  { name: "GLOBAL TOURISM", path: "/tourism" },
  { name: "NATIONAL TOURISM", path: "/national-tourism" },
  { name: "UMRAH", path: "/umrah" },
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
          <Link href="/">
            <Image src="/travelogo.png" width={60} height={60} alt="Logo" />
          </Link>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            {pages.map((page) => (
              <Link key={page.name} href={page.path} passHref>
                <Button sx={{ color: "#8B0000", fontWeight: "bold", mx: 2 }}>
                  {page.name}
                </Button>
              </Link>
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
