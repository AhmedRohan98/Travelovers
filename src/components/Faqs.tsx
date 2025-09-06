"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { ExpandMore, ArrowForward } from "@mui/icons-material";

const faqs = [
  {
    question: "HOW DO I BOOK A FLIGHT OR HOTEL?",
    answer:
      "You can book through our website or contact our support team for assistance.",
  },
  {
    question: "DO YOU OFFER CUSTOMIZED TRAVEL PACKAGES",
    answer:
      "Yes, we offer tailor-made travel packages to suit your preferences.",
  },
  {
    question: "WHAT DOCUMENTS ARE REQUIRED FOR VISA PROCESSING?",
    answer:
      "The required documents vary by destination. Please check with the respective embassy.",
  },
  {
    question: "CAN I MODIFY OR CANCEL MY BOOKING?",
    answer:
      "Yes, modifications and cancellations depend on the service provider’s policy. Check your booking details.",
  },
  {
    question: "DO YOU PROVIDE TRAVEL INSURANCE?",
    answer:
      "Yes, we offer travel insurance options for added security during your trip.",
  },
  {
    question: "ARE THERE ANY DISCOUNTS FOR GROUP BOOKINGS?",
    answer:
      "Yes, we provide discounts for group bookings. Contact us for details.",
  },
  {
    question: "WHAT HAPPENS IF MY FLIGHT GETS CANCELED?",
    answer:
      "If your flight is canceled, you will be notified and offered a refund or rebooking option.",
  },
];

const Faqs = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box
      sx={{
        display: "flex",
        textAlign: "center",
        width: "80%",
        mx: "auto",
        p: 4,
        my: 4,
      }}
    >
      {/* Left Section */}
      <Box sx={{ flex: 1, textAlign: "left", maxWidth: 350 }}>

        <Typography variant="body1" color="textSecondary" mt={2}>
          Got questions? We&apos;ve got answers! Find everything you need to
          know about our services, bookings, policies, and more.
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: "secondary.main",
            color: "white",
            borderRadius: "20px",
            px: 3,
            textTransform: "none",
            "&:hover": { backgroundColor: "#8B0000" },
          }}
          endIcon={<ArrowForward />}
        >
          Read More
        </Button>
      </Box>

      {/* Right Section (FAQs) */}
      <Box sx={{ flex: 2 }}>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{
              boxShadow: "none",
              borderBottom: "1px solid maroon",
              borderTop: `panel${index}` ? "none" : "1px solid maroon",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: "secondary.main" }} />}
            >
              <Typography
                sx={{
                  color: "secondary.main",
                }}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="secondary.main" textAlign="start">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default Faqs;
