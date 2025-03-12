import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <main>
      <Hero />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <WhyChooseUs />
      </Box>
      <Footer />
    </main>
  );
}
