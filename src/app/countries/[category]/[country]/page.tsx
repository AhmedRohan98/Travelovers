// /app/(routes)/countries/[category]/[country]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { getCountriesByCategory } from "@/lib/data/countries";
import Link from "next/link";
import Image from "next/image";
import { Box, Container, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export default function CountryDetailPage() {
  const params = useParams();
  const category = params.category as string;
  const countryName = params.country as string;

  const [expanded, setExpanded] = React.useState<string | false>("panel1");

  const countries = getCountriesByCategory(category);
  const country = countries.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase()
  );

  if (!country) {
    return <div className="container mx-auto py-8">Country not found</div>;
  }

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Banner */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 600,
          mb: 4,
          backgroundImage: `url('/assets/countries/${category}/place/${countryName}.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "black",
          zIndex: 0,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Overlay Content */}
        <Box
          sx={{
            position: "absolute",
            width: "50%",
            top: "50%",
            left: "5%",
            transform: "translateY(-50%)",
            color: "white",
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              color: "white",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Link href={`/${category}`}>
              <ArrowBackIosIcon
                sx={{
                  color: "white",
                  fontSize: "2rem",
                  "&:hover": {
                    color: "#660D17",
                  },
                  transition: "color 0.3s",
                }}
              />
            </Link>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                textTransform: "uppercase",
                fontStyle: "italic",
              }}
            >
              {country.name.replace("-", " ")}
            </Typography>
            <Box>
              <Image
                src={'flag' in country ? country.flag : country.imageUrl}
                alt="country"
                width={80}
                height={60}
                style={{
                  borderRadius: "10%",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                }}
              />
            </Box>
          </Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: 16,
              fontStyle: "italic",
            }}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
            perspiciatis ducimus excepturi quo! Molestiae illum corrupti eius
            praesentium excepturi. Quod obcaecati eius repudiandae quis nemo!
            Praesentium dolores perferendis beatae animi corporis? Sequi aliquam
            repellat in mollitia placeat labore quisquam.
          </Typography>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1,
            borderRadius: "12px",
          }}
        />
      </Box>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography component="span" sx={{ width: "33%", flexShrink: 0 }}>
            General settings
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
            Aliquam eget maximus est, id dignissim quam.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography component="span" sx={{ width: "33%", flexShrink: 0 }}>
            Users
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat
            lectus, varius pulvinar diam eros in elit. Pellentesque convallis
            laoreet laoreet.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography component="span" sx={{ width: "33%", flexShrink: 0 }}>
            Advanced settings
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
            sit amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography component="span" sx={{ width: "33%", flexShrink: 0 }}>
            Personal data
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
            sit amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}
