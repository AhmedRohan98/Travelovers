"use client";

import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
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
          .select('id, title, introduction, content, image1, image2, image3, created_at')
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, lineHeight: 1.7, fontSize: '1.1rem' }}>
          {blog.introduction}
        </Typography>
      </Box>

      {/* Images */}
      {images.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            {images.map((image, index) => (
              <Grid key={index} size={{ xs: 12, md: images.length === 1 ? 12 : 6 }}>
                <Card sx={{ overflow: 'hidden' }}>
                  <Image
                    src={image}
                    alt={`${blog.title} - Image ${index + 1}`}
                    width={600}
                    height={400}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

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
