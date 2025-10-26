"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import Link from "next/link";

const pages = [
  { name: "VISIT", path: "/visit" },
  { name: "STUDY", path: "/study" },
  { name: "GLOBAL TOURISM", path: "/global-tourism" },
  { name: "NATIONAL TOURISM", path: "/national-tourism" },
  { name: "BLOGS", path: "/blogs" },
];

export function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
        borderBottom: "3px solid #8B0000",
        py: 0.4,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 60, md: 70 } }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/assets/travelogo.png"
              width={60}
              height={60}
              alt="Logo"
              loading="lazy"
              style={{ marginRight: "10px" }}
            />
          </Link>

          {/* Mobile Hamburger Menu */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              display: { xs: "flex", md: "none" }, 
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: "#8B0000" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiPaper-root": {
                  width: "100vw !important",
                  maxWidth: "100vw !important",
                  left: "0 !important",
                  right: "0 !important",
                  marginLeft: "0 !important",
                  marginRight: "0 !important",
                  borderRadius: 0,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  border: "1px solid #e0e0e0",
                  marginTop: "8px !important",
                }
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.name} 
                  onClick={handleCloseNavMenu}
                  sx={{
                    borderBottom: "1px solid #f0f0f0",
                    py: 2,
                    px: 3,
                    "&:last-child": {
                      borderBottom: "none"
                    },
                    "&:hover": {
                      backgroundColor: "rgba(139, 0, 0, 0.05)"
                    }
                  }}
                >
                  <Link href={page.path} style={{ textDecoration: "none", color: "#333", width: "100%" }}>
                    <Typography 
                      textAlign="center" 
                      sx={{ 
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}
                    >
                      {page.name}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
              <MenuItem 
                onClick={handleCloseNavMenu}
                sx={{
                  borderBottom: "1px solid #f0f0f0",
                  py: 2,
                  px: 3,
                  "&:hover": {
                    backgroundColor: "rgba(139, 0, 0, 0.05)"
                  }
                }}
              >
                <a
                  href="https://wa.me/923255123444"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#25D366", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <WhatsAppIcon />
                  <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Contact Us
                  </Typography>
                </a>
              </MenuItem>
            </Menu>
          </Box>

          {/* Desktop Pages */}
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
                    fontSize: { md: "0.85rem", lg: "1rem" },
                    mx: { md: 1, lg: 2 },
                    px: { md: 2, lg: 3 },
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
                  fontSize: { md: "0.85rem", lg: "1rem" },
                  mx: { md: 1, lg: 2 },
                  px: { md: 2, lg: 3 },
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

          {/* Desktop Contact Section */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", ml: 2 }}>
            <WhatsAppIcon sx={{ color: "#8B0000", mr: 1.5, fontSize: { md: 24, lg: 28 } }} />
            <Box>
              <Typography variant="body2" sx={{ color: "black", fontWeight: 600, fontSize: { md: "0.75rem", lg: "0.875rem" } }}>
                Contact Us
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.3, fontSize: { md: "0.75rem", lg: "0.875rem" } }}>
                <a
                  href="https://wa.me/923255123444"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#25D366",
                    textDecoration: "none",
                    fontWeight: 600,
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

