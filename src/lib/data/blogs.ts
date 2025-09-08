import { supabase } from "@/lib/supabase/server";

export interface Blog {
  id: number;
  title: string;
  introduction: string;
  content: string;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  created_at: string;
  seo_keywords?: string;
}

// Fallback blog data
const fallbackBlogs: Blog[] = [
  {
    id: 1,
    title: "Cultural Encounters and Connections Cruise Booking and Packages",
    introduction: "Discover the rich cultural heritage and connections that await you on our exclusive cruise packages. Experience authentic encounters with local communities and traditions.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    image1: "https://images.unsplash.com/photo-1510132310763-2df322eed83f?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image2: null,
    image3: null,
    created_at: "2022-10-19T00:00:00.000Z",
    seo_keywords: "cruise, cultural, travel, packages"
  },
  {
    id: 2,
    title: "Remote Destinations and Hideaways",
    introduction: "Escape to the world's most remote and beautiful destinations. Find peace and tranquility in hidden gems that few have discovered.",
    content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...",
    image1: "https://images.unsplash.com/photo-1681566800657-f931a87b0caa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image2: null,
    image3: null,
    created_at: "2022-10-19T00:00:00.000Z",
    seo_keywords: "remote, destinations, hideaways, travel"
  },
  {
    id: 3,
    title: "Hiking Through Nature's Beauty",
    introduction: "Embark on breathtaking hiking adventures through some of the world's most stunning natural landscapes. Connect with nature like never before.",
    content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur...",
    image1: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2152&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image2: null,
    image3: null,
    created_at: "2022-10-19T00:00:00.000Z",
    seo_keywords: "hiking, nature, adventure, outdoor"
  },
  {
    id: 4,
    title: "Exploring Pakistan's Northern Wonders",
    introduction: "Discover the breathtaking beauty of Pakistan's northern regions including Hunza, Skardu, and the majestic Karakoram mountains.",
    content: "Pakistan's northern areas offer some of the most spectacular mountain scenery in the world. From the ancient Silk Road to modern adventure tourism...",
    image1: "/assets/places/hunza.jpg",
    image2: null,
    image3: null,
    created_at: "2023-05-15T00:00:00.000Z",
    seo_keywords: "Pakistan, northern areas, Hunza, Skardu, mountains"
  },
  {
    id: 5,
    title: "Study Abroad Opportunities in Europe",
    introduction: "Explore world-class education opportunities in Europe. From historic universities to modern institutions, find your perfect study destination.",
    content: "Europe offers some of the world's most prestigious universities and diverse cultural experiences for international students...",
    image1: "/assets/countries/study/place/united-kingdom.jpg",
    image2: null,
    image3: null,
    created_at: "2023-06-20T00:00:00.000Z",
    seo_keywords: "study abroad, Europe, universities, education"
  }
];

// Function to fetch the first 3 blogs for homepage
export async function getHomepageBlogs(): Promise<Blog[]> {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, using fallback data for homepage blogs');
      return fallbackBlogs.slice(0, 3);
    }

    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, introduction, content, image1, image2, image3, created_at, seo_keywords')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching homepage blogs:', error);
      return fallbackBlogs.slice(0, 3);
    }

    if (!data || data.length === 0) {
      return fallbackBlogs.slice(0, 3);
    }

    return data;
  } catch (error) {
    console.error('Error in getHomepageBlogs:', error);
    return fallbackBlogs.slice(0, 3);
  }
}

// Function to fetch all blogs for the blogs page
export async function getAllBlogs(): Promise<Blog[]> {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, using fallback data for all blogs');
      return fallbackBlogs;
    }

    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, introduction, content, image1, image2, image3, created_at, seo_keywords')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all blogs:', error);
      return fallbackBlogs;
    }

    if (!data || data.length === 0) {
      return fallbackBlogs;
    }

    return data;
  } catch (error) {
    console.error('Error in getAllBlogs:', error);
    return fallbackBlogs;
  }
}

// Function to fetch a single blog by ID
export async function getBlogById(id: string): Promise<Blog | null> {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, using fallback data for blog by ID');
      const blog = fallbackBlogs.find(b => b.id === parseInt(id));
      return blog || null;
    }

    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, introduction, content, image1, image2, image3, created_at, seo_keywords')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching blog by ID:', error);
      const blog = fallbackBlogs.find(b => b.id === parseInt(id));
      return blog || null;
    }

    return data;
  } catch (error) {
    console.error('Error in getBlogById:', error);
    const blog = fallbackBlogs.find(b => b.id === parseInt(id));
    return blog || null;
  }
}

// Helper function to get the best image for a blog
export function getBlogImage(blog: Blog): string {
  return blog.image1 || blog.image2 || blog.image3 || '/assets/hero1.jpg';
}

// Helper function to format date
export function formatBlogDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
