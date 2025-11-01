"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FlightIcon from "@mui/icons-material/Flight";
import SchoolIcon from "@mui/icons-material/School";
import PublicIcon from "@mui/icons-material/Public";
import TerrainIcon from "@mui/icons-material/Terrain";
import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";

import Link from "next/link";

const pages = [
  { name: "VISIT", path: "/visit", icon: FlightIcon },
  { name: "STUDY", path: "/study", icon: SchoolIcon },
  { name: "GLOBAL TOURISM", path: "/global-tourism", icon: PublicIcon },
  { name: "NATIONAL TOURISM", path: "/national-tourism", icon: TerrainIcon },
  { name: "BLOGS", path: "/blogs", icon: ArticleIcon },
];

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
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
              onClick={handleDrawerOpen}
              sx={{ color: "#8B0000" }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Drawer Sidebar */}
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={handleDrawerClose}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiDrawer-paper": {
                  width: "70%",
                  maxWidth: "70%",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                },
                "& .MuiBackdrop-root": {
                  backgroundColor: "rgba(0, 0, 0, 0.5)"
                }
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                }}
                role="presentation"
              >
                {/* Logo and Close Button */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <Image
                    src="/assets/travelovers_text.png"
                    width={120}
                    height={40}
                    alt="Travelovers Logo"
                    style={{ objectFit: "contain" }}
                  />
                  <IconButton
                    onClick={handleDrawerClose}
                    sx={{ color: "#8B0000" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                <List>
                  {pages.map((page) => {
                    const IconComponent = page.icon;
                    return (
                      <ListItem key={page.name} disablePadding>
                        <ListItemButton
                          onClick={handleDrawerClose}
                          sx={{
                            py: 2,
                            px: 3,
                            borderBottom: "1px solid #f0f0f0",
                            "&:hover": {
                              backgroundColor: "rgba(139, 0, 0, 0.05)"
                            }
                          }}
                        >
                          <Link href={page.path} style={{ textDecoration: "none", color: "#333", width: "100%", display: "flex", alignItems: "center" }}>
                            <IconComponent sx={{ mr: 2, fontSize: 24, color: "#8B0000" }} />
                            <ListItemText
                              primary={
                                <Typography
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: "0.9rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px"
                                  }}
                                >
                                  {page.name}
                                </Typography>
                              }
                            />
                          </Link>
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
                <Divider />
                <List>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={handleDrawerClose}
                      sx={{
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
                        style={{ textDecoration: "none", color: "#25D366", width: "100%", display: "flex", alignItems: "center", gap: "8px" }}
                      >
                        <WhatsAppIcon />
                        <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Contact Us
                        </Typography>
                      </a>
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            </Drawer>
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

