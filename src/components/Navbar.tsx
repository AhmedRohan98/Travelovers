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
  { name: "GLOBAL TOURISM", path: "/global-tourism" },
  { name: "NATIONAL TOURISM", path: "/national-tourism" },
  { name: "BLOGS", path: "/blogs" },
];

export function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
        borderBottom: "3px solid #8B0000",
        py: 0.8, // makes navbar taller
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 70 }}> {/* taller toolbar */}
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/assets/travelogo.png"
              width={80} // bigger logo
              height={80}
              alt="Logo"
              loading="lazy"
              style={{ marginRight: "20px" }}
            />
          </Link>

          {/* Pages */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {pages.slice(0, -1).map((page) => (
              <Link key={page.name} href={page.path} passHref>
                <Button
                  sx={{
                    color: "#8B0000",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    mx: 2,
                    px: 3,
                    borderRadius: "20px",
                    "&:hover": {
                      backgroundColor: "rgba(139,0,0,0.08)",
                    },
                  }}
                >
                  {page.name}
                </Button>
              </Link>
            ))}

            {/* BLOGS highlighted CTA */}
            <Link href="/blogs" passHref>
              <Button
                sx={{
                  color: "white",
                  backgroundColor: "#8B0000",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  mx: 2,
                  px: 3,
                  borderRadius: "20px",
                  "&:hover": {
                    backgroundColor: "#600000",
                  },
                }}
              >
                BLOGS
              </Button>
            </Link>
          </Box>


          {/* Help Section */}
          <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
            <ForumIcon sx={{ color: "#8B0000", mr: 1.5, fontSize: 28 }} />
            <Box>
              <Typography variant="body1" sx={{ color: "black", fontWeight: 600 }}>
                Need help?
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                <a
                  href="https://wa.me/92325123444"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#25D366",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  0325 5123 444
                </a>
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

