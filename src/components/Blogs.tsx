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
    <Box sx={{ 
      width: { xs: "95%", sm: "90%", md: "80%" }, 
      mx: "auto", 
      p: { xs: 2, md: 4 } 
    }}>
      {/* Title & Button */}
      <Box sx={{ 
        display: { xs: "block", sm: "flex" }, 
        justifyContent: "space-between", 
        mb: 3,
        textAlign: { xs: "center", sm: "left" }
      }}>
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column",
          mb: { xs: 2, sm: 0 }
        }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="secondary"
            sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
          >
            Adventure Thrills and Excitement Await
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            height: "100%",
            backgroundColor: "secondary.main",
            borderRadius: "20px",
            "&:hover": { backgroundColor: "darkred" },
            alignSelf: { xs: "center", sm: "flex-start" }
          }}
        >
          All Blogs
        </Button>
      </Box>

      {/* Blog Grid */}
      <Grid 
        container 
        spacing={{ xs: 2, md: 3 }}
        sx={{ 
          flexDirection: { xs: "column", md: "row" },
          display: "flex",
          flexWrap: "wrap"
        }}
      >
        {/* Main Blog - Left Side on Large Screens, Full Width on Mobile */}
        <Grid 
        size={{xs: 12, md: 8}}
          sx={{ 
            order: { xs: 2, md: 1 },
            pr: { md: 2 }
          }}
        >
          <Card sx={{ 
            borderRadius: "12px", 
            overflow: "hidden",
          }}>
            <CardActionArea>
              <CardMedia
                component="img"
                image={blogs[0].image}
                alt={blogs[0].title}
                loading="lazy"
                sx={{
                  height: { xs: "200px", sm: "260px", md: "400px" },
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
                <Typography
                  variant="h6"
                  color="secondary"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                    wordBreak: "break-word",
                    lineHeight: 1.2,
                  }}
                >
                  {blogs[0].title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {blogs[0].description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Smaller Blog Cards - Right Side on Large Screens, Stacked on Mobile */}
        <Grid 
          container 
          size={{xs: 12, md: 4}}
          spacing={2}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          order={{xs: 2, md: 2}}
        >
          {blogs.slice(1).map((blog) => (
            <Grid 
              key={blog.id} 
              size={{xs: 12}}
            >
              <Card
                sx={{
                  borderRadius: "12px",
                  height: "100%",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                <CardActionArea
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    height: "100%",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={blog.image}
                    alt={blog.title}
                    loading="lazy"
                    sx={{
                      width: { xs: "100%", md: 140 },
                      height: { xs: 200, md: "100%" },
                      objectFit: "cover",
                      "&:hover": { opacity: 0.9 },
                      flexShrink: 0,
                    }}
                  />
                  <CardContent sx={{ flex: 1 }}>
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
                      sx={{
                        fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                        wordBreak: "break-word",
                        lineHeight: 1.2,
                      }}
                    >
                      {blog.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                    >
                      {blog.description}
                    </Typography>
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