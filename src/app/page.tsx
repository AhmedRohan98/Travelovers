import Adventure from "@/components/Adventure";
import BlogSection from "@/components/Blogs";
import Footer from "@/components/Footer";
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
      </Box>
      <Footer />
    </main>
  );
};

export default Home;
