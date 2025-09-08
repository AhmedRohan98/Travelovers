"use client";

import {
  Box,
  Container,
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
  Skeleton,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/server";

interface Blog {
  id: number;
  title: string;
  introduction: string;
  content: string;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  created_at: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blogs')
          .select('id, title, introduction, content, image1, image2, image3, created_at')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching blogs:', error);
          setError('Failed to load blogs');
        } else {
          setBlogs(data || []);
        }
      } catch (err) {
        console.error('Error in fetchBlogs:', err);
        setError('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBlogImage = (blog: Blog) => {
    return blog.image1 || blog.image2 || blog.image3 || '/assets/hero1.jpg';
  };
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
        <Grid size={{ xs: 12, md: 8 }}>
          {loading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} sx={{ display: "flex", mb: 4 }}>
                <Skeleton variant="rectangular" width={200} height={150} />
                <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="80%" height={30} />
                    <Skeleton variant="text" width="100%" height={60} />
                  </CardContent>
                </Box>
              </Card>
            ))
          ) : error ? (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          ) : blogs.length === 0 ? (
            <Alert severity="info" sx={{ mb: 4 }}>
              No blogs found.
            </Alert>
          ) : (
            blogs.map((blog) => (
              <Link key={blog.id} href={`/blogs/${blog.id}`} style={{ textDecoration: 'none' }}>
                <Card sx={{ display: "flex", mb: 4, cursor: "pointer", boxShadow: "0px 2px 6px rgba(0,0,0,0.08)", transition: "all 0.3s ease", "&:hover": { transform: "translateY(-3px)", boxShadow: "0px 8px 20px rgba(0,0,0,0.25)" } }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 200, height: 150, objectFit: 'cover' }}
                    image={getBlogImage(blog)}
                    alt={blog.title}
                  />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent>
                      <Typography variant="caption" color="textSecondary">
                        {formatDate(blog.created_at)}
                      </Typography>
                      <Typography
                        variant="h5"
                        component="h2"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                          fontSize: { xs: "1.0rem", md: "1.25rem" }, // smaller and scalable
                          lineHeight: 1.2,
                          letterSpacing: "0.3px",
                          color: "#222",
                          position: "relative",
                          display: "inline-block",
                          pb: 0.8, // space for underline
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            bottom: 0,
                            width: "50%", // short decorative underline
                            height: "3px",
                            borderRadius: "2px",
                            background: "linear-gradient(90deg,rgb(255, 47, 0), #FF4500)", // softer orange-red gradient
                          },
                        }}
                      >
                        {blog.title}
                      </Typography>
                      
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2, // show max 3 lines
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {blog.introduction}
                      </Typography>

                    </CardContent>
                  </Box>
                </Card>
              </Link>
            ))
          )}
          {blogs.length > 0 && <Pagination count={Math.ceil(blogs.length / 6)} shape="rounded" />}
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Search here"
            variant="outlined"
            sx={{ mb: 4 }}
          />

          <Box mb={4}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Recent Posts
            </Typography>
            <List>
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <ListItem key={index} disablePadding>
                    <Skeleton variant="text" width="100%" height={40} />
                  </ListItem>
                ))
              ) : (
                blogs.slice(0, 5).map((blog) => (
                  <Link key={blog.id} href={`/blogs/${blog.id}`} style={{ textDecoration: 'none' }}>
                    <ListItem disablePadding sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}>
                      <ListItemText 
                        primary={blog.title} 
                        secondary={formatDate(blog.created_at)}
                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                        secondaryTypographyProps={{ fontSize: '0.8rem' }}
                      />
                    </ListItem>
                  </Link>
                ))
              )}
            </List>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Popular Tags
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {["Hunza", "Annual Leaves", "North", "Nature"].map((tag, i) => (
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
