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

const Footer = () => {
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
      <Container maxWidth="lg">
        {/* Logo at the top, always centered */}
        <Box display="flex" justifyContent="flex-start" width="100%" mb={4}>
          <Image
            src="/assets/travelovers_text.png"
            width={200}
            height={80}
            alt="Logo"
            loading="lazy"
          />
        </Box>
        {/* Main Footer Section: responsive row/column */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems={{ xs: "stretch", md: "flex-start" }}
          justifyContent="space-between"
          gap={{ xs: 4, md: 0 }}
        >
          {/* Left Section - About */}
          <Box flex={1} minWidth={220} mb={{ xs: 2, md: 0 }} textAlign={{ xs: "center", md: "left" }}>
            <Typography variant="body2" my={2}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
              <br />
              aliquam, purus sit amet luctus venenatis, lectus magna fringilla
              urna.
            </Typography>
            <Box mt={2} style={{ width: "fit-content", margin: "0 auto" }}>
              <Box display="flex" alignItems="center" gap={1}>
                <EmailIcon />
                <Typography variant="body2">travelovers@email.com</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <CallIcon />
                <Typography variant="body2">051-14343234</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mt={1} textAlign={"left"}>
                <LocationOnIcon />
                <Typography variant="body2">
                  4th Floor Office No, B, 402, SECTOR Gulberg Greens Block B Islamabad
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
                "Visit",
                "Study",
                "Umrah",
                "Immigration",
                "National Tourism",
                "International Tours",
              ].map((item) => (
                <Typography key={item} variant="body2">
                  {item}
                </Typography>
              ))}
            </Box>
            {/* About */}
            <Box minWidth={120} textAlign={{ xs: "center", sm: "left" }}>
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
            {/* Follow Us */}
            <Box minWidth={120} textAlign={{ xs: "center", sm: "left" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Follow Us On
              </Typography>
              <Box display="flex" flexDirection="row" gap={1} justifyContent={{ xs: "center", sm: "flex-start" }}>
                <Link
                  href="https://www.instagram.com/travelovers_visa/"
                  color="inherit"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <InstagramIcon />
                </Link>
                <Link
                  href="https://web.facebook.com/traveloversvisa"
                  color="inherit"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <FacebookIcon />
                </Link>
                <Link
                  href="#"
                  color="inherit"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <TwitterIcon />
                </Link>
                <Link
                  href="https://travelovers.pk"
                  color="inherit"
                  display="flex"
                  alignItems="center"
                  gap={1}
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
