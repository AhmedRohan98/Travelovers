"use client";

import {
  Box,
  Container,
  Typography,
  Card,
  Breadcrumbs,
  Skeleton,
  Alert,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/server";
import Image from "next/image";

interface Blog {
  id: number;
  title: string;
  introduction: string;
  content: string;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  created_at: string;
  seo_keywords: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const blogId = params.id as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blogs')
          .select('id, title, introduction, content, image1, image2, image3, seo_keywords, created_at')
          .eq('id', blogId)
          .single();

        if (error) {
          console.error('Error fetching blog:', error);
          setError('Blog not found');
        } else {
          setBlog(data);
        }
      } catch (err) {
        console.error('Error in fetchBlog:', err);
        setError('Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBlogImages = (blog: Blog) => {
    const images = [];
    if (blog.image1) images.push(blog.image1);
    if (blog.image2) images.push(blog.image2);
    if (blog.image3) images.push(blog.image3);
    return images.length > 0 ? images : ['/assets/hero1.jpg'];
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 4 }} />
        <Skeleton variant="text" width="100%" height={200} />
      </Container>
    );
  }

  if (error || !blog) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Blog not found'}
        </Alert>
        <Link href="/blogs">
          <Typography variant="body1" sx={{ color: '#B90C1C', textDecoration: 'underline' }}>
            ← Back to Blogs
          </Typography>
        </Link>
      </Container>
    );
  }

  const images = getBlogImages(blog);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          Home
        </Link>
        <Link href="/blogs" style={{ color: 'inherit', textDecoration: 'none' }}>
          Blog
        </Link>
        <Typography color="text.primary">{blog.title}</Typography>
      </Breadcrumbs>

      {/* Blog Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 2, color: '#B90C1C' }}>
          {blog.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {formatDate(blog.created_at)}
        </Typography>
        <Divider sx={{ mb: 4 }} />
      </Box>

      {/* Introduction */}
      <Box sx={{ 
        mb: 6,
        p: 4,
        borderRadius: 2,
        bgcolor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderLeft: '4px solid #B90C1C'
      }}>
        <Typography variant="h6" sx={{ 
          mb: 0, 
          lineHeight: 1.7, 
          fontSize: '1.1rem',
          color: '#495057',
          fontStyle: 'italic'
        }}>
          {blog.introduction}
        </Typography>
      </Box>

      {/* Main Content Layout */}
      <Grid container spacing={4}>
        {/* Left Column - Content */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Content */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                lineHeight: 1.8, 
                fontSize: '1.1rem',
                '& p': { mb: 2 },
                '& h1, & h2, & h3, & h4, & h5, & h6': { 
                  mt: 3, 
                  mb: 2, 
                  color: '#B90C1C',
                  fontWeight: 'bold'
                },
                '& ul, & ol': { 
                  pl: 3, 
                  mb: 2 
                },
                '& li': { 
                  mb: 1 
                }
              }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </Box>

          {/* Popular Tags */}
          {blog.seo_keywords && (
            <Box
              sx={{
                mb: 4,
                p: 2,
                borderRadius: 1,
                bgcolor: "#fafafa",
                border: "1px solid #f0f0f0",
                opacity: 0.8
              }}
            >
              <Typography
                variant="caption"
                sx={{ mb: 1.5, fontSize: "0.75rem", color: "#999", fontWeight: 400 }}
              >
                Tags
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {blog.seo_keywords.split(",").map((tag, index) => (
                  <Box
                    key={index}
                    sx={{
                      px: 1.5,
                      py: 0.3,
                      borderRadius: "12px",
                      fontSize: "0.7rem",
                      color: "#666",
                      bgcolor: "#f5f5f5",
                      border: "1px solid #e0e0e0",
                      fontWeight: 400,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: '#e0e0e0',
                        color: '#333'
                      }
                    }}
                  >
                    {tag.trim()}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Grid>

        {/* Right Column - Images Sidebar */}
        {images.length > 0 && (
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ 
              position: { lg: 'sticky' },
              top: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 26
            }}>
              {images.map((image, index) => (
                <Card 
                  key={index} 
                  sx={{ 
                    overflow: 'hidden',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease-in-out',
                    border: '1px solid #e9ecef',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <Image
                    src={image}
                    alt={`${blog.title}`}
                    width={280}
                    height={200}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                    }}
                  />
                  <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#495057',
                        fontSize: '0.875rem',
                        lineHeight: 1.4,
                        fontStyle: 'italic'
                      }}
                    >
                      {blog.title} - Image {index + 1}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Back to Blogs */}
      <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #e0e0e0' }}>
        <Link href="/blogs">
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#B90C1C', 
              textDecoration: 'underline',
              '&:hover': { color: '#a00a18' },
              cursor: 'pointer'
            }}
          >
            ← Back to All Blogs
          </Typography>
        </Link>
      </Box>
    </Container>
  );
}
