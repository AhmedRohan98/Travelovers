import Adventure from "@/components/Adventure";
import BlogSection from "@/components/Blogs";
import Faqs from "@/components/Faqs";
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
          px: 2,
        }}
      >
        <WhyChooseUs />
        <Adventure />
        <BlogSection />
        <Testimonials />
        <Faqs />
      </Box>
    </main>
  );
};

export default Home;
