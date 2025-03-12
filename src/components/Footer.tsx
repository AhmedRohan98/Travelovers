"use client";

import { Box, Container, Typography, Link } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import Image from "next/image";

export function Footer() {
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
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.1,
          zIndex: 0,
        }}
      />
      <Container maxWidth="lg">
        {/* Main Footer Section */}
        <Image
          src="/assets/travelovers_text.png"
          width={200}
          height={300}
          alt="Logo"
        />
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
          {/* Left Section - About */}
          <Box flex={1} style={{ width: "fit-content" }}>
            <Typography variant="body2" mt={2}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
              <br />
              aliquam, purus sit amet luctus venenatis, lectus magna fringilla
              urna.
            </Typography>
            <Box mt={2} style={{ width: "fit-content" }}>
              <Box display="flex" alignItems="center" gap={1}>
                <EmailIcon />
                <Typography variant="body2">travelovers@email.com</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <CallIcon />
                <Typography variant="body2">051-14343234</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <LocationOnIcon />
                <Typography variant="body2">
                  Sanda Chowk, Gulberg Greens, Islamabad
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Middle Section - Links */}
          <Box flex={1} display="flex" flexDirection="row" gap={10}>
            {/* Services */}
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Services
              </Typography>
              {[
                "Visit",
                "Study",
                "Umrah",
                "Immigration",
                "Nat'l Tourism",
                "Intl Tours",
              ].map((item) => (
                <Typography key={item} variant="body2">
                  {item}
                </Typography>
              ))}
            </Box>
            {/* About */}
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                About Us
              </Typography>
              {[
                "Who We Are",
                "Our Story",
                "Our Partners",
                "Why Choose Us",
                "Contact Us",
              ].map((item) => (
                <Typography key={item} variant="body2">
                  {item}
                </Typography>
              ))}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Follow Us On
              </Typography>
              <Link
                href="#"
                color="inherit"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <InstagramIcon /> @travelovers_visa
              </Link>
              <Link
                href="#"
                color="inherit"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <FacebookIcon /> @travelovers_visa
              </Link>
              <Link
                href="#"
                color="inherit"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <TwitterIcon /> @travelovers_visa
              </Link>
              <Link
                href="#"
                color="inherit"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <LanguageIcon /> https://travelovers.pk
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Copyright */}
        <Box mt={5} textAlign="start" borderTop="1px solid " pt={2}>
          <Typography variant="body2">
            © 2024 TravelLovers. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
