"use client";

import { Box, Container, Typography, Link } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon  from "@mui/icons-material/WhatsApp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LanguageIcon from "@mui/icons-material/Language";
import Image from "next/image";
import NextLink from "next/link";
import { getAllBlogs, Blog } from "@/lib/data/blogs";
import { useEffect, useState } from "react";


const Footer = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getAllBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs for footer:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(to bottom, #450811, #AB142A)",
        color: "white",
        py: 5,
        mt: 10,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/assets/travelogo.png')",
          backgroundSize: "400px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.1,
          zIndex: 0,
        }}
      />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Logo at the top */}
        <Box display="flex" justifyContent="flex-start" width="100%" mb={4}>
          <Image
            src="/assets/travelovers_text.png"
            width={200}
            height={80}
            alt="Logo"
            loading="lazy"
          />
        </Box>

        {/* Main Footer Section */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems={{ xs: "stretch", md: "flex-start" }}
          justifyContent="space-between"
          gap={{ xs: 4, md: 0 }}
        >
          {/* Left Section - About */}
          <Box
            flex={1}
            minWidth={220}
            mb={{ xs: 2, md: 0 }}
            textAlign={{ xs: "center", md: "left" }}
          >
            <Typography variant="body2" my={2}>
            Travelovers is a trusted visa consultancy and travel solutions company. We specialize in study visas, visit visas, and tourism services—guiding students to study abroad, assisting travelers with smooth visa processes, and offering tailored tourism experiences for confident, easy travel.
            </Typography>

            <Box mt={2} style={{ width: "fit-content", margin: "0 auto" }}>
              <Box display="flex" alignItems="center" gap={1}>
                <EmailIcon />
                <Typography variant="body2">
                  travelovers.pk@gmail.com
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <WhatsAppIcon  />
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                <a
                  href="https://wa.me/92325123444"
                  target="_blank"
                  rel="noopener noreferrer"
                  >
                  0325 5123 444
                </a>
              </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                mt={1}
                textAlign={"left"}
              >
                <LocationOnIcon />
                <Typography variant="body2">
                  4th Floor Office No, B, 402, SECTOR Gulberg Greens Block B
                  Islamabad
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Middle Section - Links */}
          <Box
            flex={2}
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            gap={{ xs: 2, sm: 8, md: 10 }}
            justifyContent="center"
            alignItems={{ xs: "center", sm: "center" }}
            mt={{ xs: 4, md: 0 }}
          >
            {/* Services */}
            <Box minWidth={120} textAlign={{ xs: "center", sm: "left" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Services
              </Typography>
              {[
                { name: "Visit", path: "/visit" },
                { name: "Study", path: "/study" },
                { name: "National Tourism", path: "/national-tourism" },
                { name: "International Tours", path: "/global-tourism" },
              ].map((item) => (
                <NextLink key={item.name} href={item.path} style={{ textDecoration: "none" }}>
                  <Box
                    sx={{
                      display: "block",
                      mb: 0.5,
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "inherit",
                      position: "relative",
                      zIndex: 2,
                      "&:hover": {
                        color: "#ffd700",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    <Typography variant="body2">
                      {item.name}
                    </Typography>
                  </Box>
                </NextLink>
              ))}
            </Box>

            {/* Blogs */}
            <Box minWidth={120} textAlign={{ xs: "center", sm: "left" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Blogs
              </Typography>
              {loading ? (
                // Loading state
                Array.from({ length: 4 }).map((_, index) => (
                  <Box key={index} sx={{ mb: 0.5 }}>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                      Loading...
                    </Typography>
                  </Box>
                ))
              ) : blogs.length === 0 ? (
                // No blogs state
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                  No blogs available
                </Typography>
              ) : (
                // Display actual blogs
                blogs.slice(0, 4).map((blog: Blog) => (
                  <NextLink key={blog.id} href={`/blogs/${blog.id}`} style={{ textDecoration: "none" }}>
                    <Box
                      sx={{
                        display: "block",
                        mb: 0.5,
                        cursor: "pointer",
                        textDecoration: "none",
                        color: "inherit",
                        position: "relative",
                        zIndex: 2,
                        "&:hover": {
                          color: "#ffd700",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      <Typography variant="body2">
                        {blog.title.length > 40 
                          ? `${blog.title.substring(0, 40)}...` 
                          : blog.title
                        }
                      </Typography>
                    </Box>
                  </NextLink>
                ))
              )}
            </Box>

            {/* Follow Us */}
            <Box minWidth={120} textAlign={{ xs: "center", sm: "left" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Follow Us On
              </Typography>
              <Box
                display="flex"
                flexDirection="row"
                gap={1}
                justifyContent={{ xs: "center", sm: "flex-start" }}
              >
                <Link
                  href="https://www.instagram.com/travelovers_visa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    zIndex: 2,
                    "&:hover": {
                      color: "#ffd700",
                    },
                  }}
                >
                  <InstagramIcon />
                </Link>
                <Link
                  href="https://web.facebook.com/traveloversvisa"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    zIndex: 2,
                    "&:hover": {
                      color: "#ffd700",
                    },
                  }}
                >
                  <FacebookIcon />
                </Link>
                <Link
                  href="https://www.youtube.com/@Traveloverspk"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    zIndex: 2,
                    "&:hover": {
                      color: "#ffd700",
                    },
                  }}
                >
                  <YouTubeIcon />
                </Link>
                <Link
                  href="https://travelovers.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    zIndex: 2,
                    "&:hover": {
                      color: "#ffd700",
                    },
                  }}
                >
                  <LanguageIcon />
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Copyright */}
        <Box mt={5} textAlign="center" borderTop="1px solid" pt={2}>
          <Typography variant="body2">
            © 2024 TravelLovers. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
