import React from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

const blogs = [
  {
    id: 1,
    title: "Cultural Encounters and Connections Cruise Booking and Packages",
    date: "October 19, 2022",
    author: "admin",
    image:
      "https://images.unsplash.com/photo-1510132310763-2df322eed83f?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem Ipsum is simply dummy text the printing and typesetting industry...",
  },
  {
    id: 2,
    title: "Remote Destinations and Hideaways",
    date: "October 19, 2022",
    author: "admin",
    image:
      "https://images.unsplash.com/photo-1681566800657-f931a87b0caa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem Ipsum is simply dummy text the printing and typesetting industry...",
  },
  {
    id: 3,
    title: "Hiking Through Nature's Beauty",
    date: "October 19, 2022",
    author: "admin",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2152&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem Ipsum is simply dummy text the printing and typesetting industry...",
  },
];

const BlogSection = () => {
  return (
    <Box sx={{ width: "80%", mx: "auto", p: 4 }}>
      {/* Title & Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="inherit" color="primary">
            RECENT BLOGS
          </Typography>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="secondary"
          >
            Adventure Thrills and Excitement Await
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            height: "fit-content",
            backgroundColor: "secondary.main",
            borderRadius: "20px",
            "&:hover": { backgroundColor: "darkred" },
          }}
        >
          All Blogs →
        </Button>
      </Box>

      {/* Blog Grid */}
      <Grid container spacing={3}>
        {/* Main Blog - Spans 2 Columns */}
        <Grid size={{ xs: 6, md: 8 }}>
          <Card sx={{ borderRadius: "12px", overflow: "hidden" }}>
            <CardActionArea>
              <CardMedia
                component="img"
                image={blogs[0].image}
                alt={blogs[0].title}
                sx={{
                  height: "260px",
                  objectFit: "cover",
                  "&:hover": { opacity: 0.9 },
                }}
              />
              <CardContent>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <CalendarMonthIcon fontSize="inherit" />
                  {blogs[0].date}
                  <PersonOutlineOutlinedIcon fontSize="inherit" />
                  {blogs[0].author}
                </Typography>
                <Typography variant="h6" color="secondary" fontWeight="bold">
                  {blogs[0].title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {blogs[0].description}
                </Typography>
                <Button size="small" color="primary">
                  Read More →
                </Button>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Smaller Blog Cards */}
        <Grid container spacing={1} size={{ xs: 6, md: 4 }}>
          {blogs.slice(1).map((blog) => (
            <Grid
              key={blog.id}
              height="fit-content"
              sx={{ marginBottom: "auto" }}
            >
              <Card
                key={blog.id}
                sx={{
                  borderRadius: "12px",
                  height: "200px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <CardActionArea sx={{ display: "flex" }}>
                  <CardMedia
                    component="img"
                    image={blog.image}
                    alt={blog.title}
                    sx={{
                      width: "100px",
                      height: "100%",
                      objectFit: "cover",
                      "&:hover": { opacity: 0.9 },
                    }}
                  />
                  <CardContent>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <CalendarMonthIcon fontSize="inherit" />
                      {blog.date}
                      <PersonOutlineOutlinedIcon fontSize="inherit" />
                      {blog.author}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="secondary"
                      fontWeight="bold"
                    >
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {blog.description}
                    </Typography>
                    <Button size="small" color="primary">
                      Read More →
                    </Button>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BlogSection;
