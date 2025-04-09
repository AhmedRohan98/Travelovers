import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Pagination,
  TextField,
  List,
  ListItem,
  ListItemText,
  Breadcrumbs,
} from "@mui/material";
import Link from "next/link";

const blogs = [
  {
    id: 1,
    title: "Wonders of Ancient Civilizations A Journey Through Egypt",
    description:
      "Discover the timeless wonders of Egypt in a journey through ancient civilizations and majestic landscapes.",
    image: "/egypt.jpg",
    date: "March 25, 2025",
    category: "Travel",
  },
  {
    id: 2,
    title: "The Road to Adventure Embarking on New Horizons",
    description:
      "Explore new destinations, embrace the thrill of the road, and find beauty in the journey.",
    image: "/road.jpg",
    date: "March 24, 2025",
    category: "Adventure",
  },
  {
    id: 3,
    title: "Journeys of Discovery Uncovering Hidden Treasures",
    description:
      "Join us as we uncover hidden gems and tales of mystery from around the globe.",
    image: "/treasure.jpg",
    date: "March 23, 2025",
    category: "Discovery",
  },
];

export default function BlogPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 300,
          mb: 4,
          backgroundImage: "url('/assets/hero5.jpg')",
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
            top: "50%",
            left: "10%",
            transform: "translateY(-50%)",
            color: "white",
            zIndex: 2,
          }}
        >
          <Typography variant="h3" fontWeight="bold">
            Blog
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" sx={{ color: "white" }}>
            <Link href="/" passHref>
              Home
            </Link>
            <Typography color="white">Blog</Typography>
          </Breadcrumbs>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
            borderRadius: "12px",
          }}
        />
      </Box>
      <Grid container spacing={4}>
        {/* Blog Posts */}
        <Grid item xs={12} md={8}>
          {blogs.map((blog) => (
            <Card key={blog.id} sx={{ display: "flex", mb: 4 }}>
              <CardMedia
                component="img"
                sx={{ width: 200 }}
                image={blog.image}
                alt={blog.title}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent>
                  <Typography variant="caption" color="textSecondary">
                    {blog.date} • {blog.category}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {blog.title}
                  </Typography>
                  <Typography variant="body2">{blog.description}</Typography>
                </CardContent>
              </Box>
            </Card>
          ))}
          <Pagination count={3} shape="rounded" />
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search here"
            variant="outlined"
            sx={{ mb: 4 }}
          />

          <Box mb={4}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Popular Post
            </Typography>
            <List>
              {blogs.map((blog) => (
                <ListItem key={blog.id} disablePadding>
                  <ListItemText primary={blog.title} secondary={blog.date} />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Category
            </Typography>
            <List>
              {[...new Set(blogs.map((blog) => blog.category))].map(
                (cat, i) => (
                  <ListItem key={i} disablePadding>
                    <ListItemText primary={cat} />
                  </ListItem>
                )
              )}
            </List>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Popular Tags
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {["Travel", "Adventure", "Culture", "Nature"].map((tag, i) => (
                <Button key={i} variant="outlined" size="small">
                  {tag}
                </Button>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
