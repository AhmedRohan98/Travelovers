"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Skeleton,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Link from "next/link";
import { getHomepageBlogs, getBlogImage, formatBlogDate, type Blog } from "@/lib/data/blogs";

const BlogSection = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getHomepageBlogs();
        setBlogs(data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);
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
        <Link href="/blogs" style={{ textDecoration: 'none' }}>
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
        </Link>
      </Box>

      {/* Blog Grid */}
      {loading ? (
        // Loading skeletons
        <Grid 
          container 
          spacing={{ xs: 2, md: 3 }}
          sx={{ 
            flexDirection: { xs: "column", md: "row" },
            display: "flex",
            flexWrap: "wrap"
          }}
        >
          <Grid size={{xs: 12, md: 8}} sx={{ order: { xs: 2, md: 1 }, pr: { md: 2 } }}>
            <Card sx={{ borderRadius: "12px", overflow: "hidden" }}>
            <Skeleton variant="rectangular" sx={{ height: { xs: 200, sm: 260, md: 400 } }}/>

              <CardContent>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="100%" height={60} />
              </CardContent>
            </Card>
          </Grid>
          <Grid container size={{xs: 12, md: 4}} spacing={2} display="flex" flexDirection="column" order={{xs: 2, md: 2}}>
            {[1, 2].map((index) => (
              <Grid key={index} size={{xs: 12}}>
                <Card sx={{ borderRadius: "12px", height: "100%", overflow: "hidden", display: "flex", flexDirection: { xs: "column", md: "row" } }}>
                <Skeleton variant="rectangular" sx={{ width: { xs: "100%", md: 140 }, height: { xs: 200, md: "100%" }  }}/>
                  <CardContent sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="50%" height={20} />
                    <Skeleton variant="text" width="90%" height={25} />
                    <Skeleton variant="text" width="100%" height={40} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : blogs.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          No blogs found.
        </Alert>
      ) : (
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
            <Link href={`/blogs/${blogs[0].id}`} style={{ textDecoration: 'none' }}>
              <Card sx={{ 
                borderRadius: "12px", 
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": { 
                  transform: "translateY(-3px)", 
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.25)" 
                }
              }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    image={getBlogImage(blogs[0])}
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
                      {formatBlogDate(blogs[0].created_at)}
                      <PersonOutlineOutlinedIcon fontSize="inherit" />
                      admin
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
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {blogs[0].introduction}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>

          {/* Smaller Blog Cards - Right Side on Large Screens, Stacked on Mobile */}
          <Grid 
            container 
            size={{xs: 12, md: 4}}
            spacing={0}
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            order={{xs: 2, md: 2}}
            gap={{ xs: 2, md: 0 }}
          >
            {blogs.slice(1).map((blog) => (
              <Grid 
                key={blog.id} 
                size={{xs: 12}}
                sx={{ 
                  display: "flex",
                  height: { xs: "auto", md: "calc((100% - 24px) / 2)" }
                }}
              >
                <Link href={`/blogs/${blog.id}`} style={{ textDecoration: 'none', width: "100%", display: "flex" }}>
                  <Card
                    sx={{
                      borderRadius: "12px",
                      height: "100%",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: { xs: "row", md: "row" },
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      width: "100%",
                      "&:hover": { 
                        transform: "translateY(-2px)", 
                        boxShadow: "0px 6px 20px rgba(0,0,0,0.15)" 
                      }
                    }}
                  >
                    <CardActionArea
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "row", md: "row" },
                        height: "100%",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={getBlogImage(blog)}
                        alt={blog.title}
                        loading="lazy"
                        sx={{
                          width: { xs: "40%", md: "45%" },
                          height: { xs: "140px", md: "180px" },
                          objectFit: "cover",
                          "&:hover": { opacity: 0.9 },
                          flexShrink: 0,
                        }}
                      />
                      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="flex"
                            alignItems="center"
                            gap={0.5}
                            sx={{ fontSize: "0.7rem" }}
                          >
                            <CalendarMonthIcon fontSize="inherit" />
                            {formatBlogDate(blog.created_at)}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color="secondary"
                            fontWeight="bold"
                            sx={{
                              fontSize: { xs: "0.85rem", md: "0.95rem" },
                              wordBreak: "break-word",
                              lineHeight: 1.3,
                              mt: 0.5,
                            }}
                          >
                            {blog.title}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {blog.introduction}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default BlogSection;