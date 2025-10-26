import Adventure from "@/components/Adventure";
import BlogSection from "@/components/Blogs";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs";
import { Box } from "@mui/material";

const Home = () => {
  return (
    <main>
      <Hero />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 1, md: 2 },
        }}
      >
        <WhyChooseUs />
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Adventure />
        </Box>
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <BlogSection />
        </Box>
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Testimonials />
        </Box>
      </Box>
    </main>
  );
};

export default Home;
