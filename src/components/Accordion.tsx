// components/MyAccordion.tsx
import React, { ReactNode, useState } from "react";
import { Box, Typography, Collapse, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircleIcon from "@mui/icons-material/Circle";

interface MyAccordionProps {
  title: ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const AccordionContainer = styled(Box)(({ theme }) => ({
  border: "1px solid #ccc",
  borderRadius: 8,
  overflow: "hidden",
  marginBottom: theme.spacing(1),
}));

const AccordionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  cursor: "pointer",
  backgroundColor: "#AB142A",
  color: "#fff",
}));

const AccordionContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "#fff",
}));

export const Accordion: React.FC<MyAccordionProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <AccordionContainer>
      <AccordionHeader onClick={() => setOpen(!open)}>
        <Typography variant="h6">
          <IconButton
            size="small"
            sx={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease-in-out",
              color: "#fff",
            }}
          >
            <CircleIcon />
          </IconButton>
          {title}
        </Typography>
        <IconButton
          size="small"
          sx={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease-in-out",
            color: "#fff",
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </AccordionHeader>
      <Collapse in={open}>
        <AccordionContent>{children}</AccordionContent>
      </Collapse>
    </AccordionContainer>
  );
};
