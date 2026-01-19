// Open Graph configuration for each page
// This is used by the server to inject the correct OG meta tags for social media crawlers

import { getBlogPostBySlug, getCaseStudyBySlug } from "../db";

export interface OGConfig {
  title: string;
  description: string;
  image: string;
  type?: string;
  imageWidth?: number;
  imageHeight?: number;
}

// Default OG config
const defaultOG: OGConfig = {
  title: "Umbrella Broadband | Managed Connectivity Solutions",
  description: "Umbrella Broadband provides fully managed broadband, VoIP, and security solutions for landlords, businesses, and developers across the UK.",
  image: "/images/og-image.jpg",
  type: "website",
  imageWidth: 1200,
  imageHeight: 630
};

// Page-specific OG configurations
export const ogConfigs: Record<string, OGConfig> = {
  "/": {
    title: "Umbrella Broadband | Managed Connectivity",
    description: "Umbrella Broadband provides fast, reliable, and secure connectivity solutions for landlords, businesses, and developers. Fully managed networks you can trust.",
    image: "/images/hero-aerial-v14.jpg",
    type: "website",
    imageWidth: 1200,
    imageHeight: 630
  },
  "/about": {
    title: "About Umbrella Broadband | UK Connectivity Experts",
    description: "Learn about Umbrella Broadband's mission to deliver seamless, high-speed internet and security solutions. We are dedicated to keeping you connected.",
    image: "/images/about-hero.jpg",
    type: "website",
    imageWidth: 1200,
    imageHeight: 630
  },
  "/sectors": {
    title: "Sectors We Serve | Umbrella Broadband Solutions",
    description: "Tailored broadband and security solutions for Landlords, Developers, Businesses, and Student Accommodation. Find the right fit for your sector.",
    image: "/images/sectors-hero-desktop.jpg",
    type: "website",
    imageWidth: 1200,
    imageHeight: 630
  },
  "/solutions": {
    title: "Solutions | Umbrella Broadband",
    description: "Explore our comprehensive range of services including Managed Broadband, VoIP Telephony, CCTV Security, and Management Services.",
    image: "/images/og-image.jpg",
    type: "website",
    imageWidth: 1200,
    imageHeight: 630
  },
  "/solutions/managed-broadband": {
    title: "Managed Broadband | Umbrella Broadband",
    description: "Fully managed broadband for businesses and landlords. High-speed fibre, 24/7 monitoring, and dedicated UK support.",
    image: "/images/solutions/broadband-hero-desktop.jpg",
    type: "website",
    imageWidth: 1200,
    imageHeight: 630
  },
  "/solutions/voip": {
    title: "VoIP Phone Systems | Umbrella Broadband",
    description: "Cloud-based VoIP phone systems for businesses. Reduce costs, work from anywhere, and get enterprise features at SME prices. Hosted telephony with UK support.",
    image: "/images/solutions/voip-hero-desktop.jpg",
    type: "website",
    imageWidth: 1200,
    imageHeight: 630
  },
  "/solutions/cctv": {
    title: "CCTV & Security Systems | Umbrella Broadband",
    description: "Professional CCTV installation and monitoring for UK businesses. HD cameras, cloud recording, remote viewing, and 24/7 support.",
    image: "/images/solutions/cctv-hero-desktop.jpg",
    type: "website",
    imageWidth: 1200,
    imageHeight: 630
  },
  "/solutions/access-control": {
    title: "Access Control Solutions | Umbrella Broadband",
    description: "Professional access control and intercom installation for UK businesses. Keyless entry, video intercoms, and biometric systems.",
    image: "/images/solutions/access-control-hero-desktop.jpg",
    type: "website",
    imageWidth: 1200,
    imageHeight: 630
  },
  "/solutions/starlink": {
    title: "Managed Starlink Services | Umbrella Broadband",
    description: "Professional Starlink installation and management for UK businesses. Emergency backup, rural connectivity, and events with 24/7 support.",
    image: "/images/solutions/starlink-hero-desktop.jpg",
    type: "website",
    imageWidth: 1200,
    imageHeight: 630
  },
  "/case-studies": {
    title: "Case Studies | Umbrella Broadband Success Stories",
    description: "Discover how Umbrella Broadband has helped businesses and organizations achieve reliable, high-speed connectivity. Read our client success stories.",
    image: "/images/og-image.jpg",
    type: "website",
    imageWidth: 1200,
    imageHeight: 630
  },
  "/blog": {
    title: "Blog | Latest News & Insights | Umbrella Broadband",
    description: "Stay updated with the latest news, industry trends, and insights from Umbrella Broadband. Read our blog for expert advice.",
    image: "/images/og-image.jpg",
    type: "website",
    imageWidth: 1200,
    imageHeight: 630
  },
  "/contact": {
    title: "Contact Umbrella Broadband | Get in Touch Today",
    description: "Get in touch with Umbrella Broadband for expert advice on your connectivity needs. Call us, email us, or visit our office in Leamington Spa.",
    image: "/images/og-image.jpg",
    type: "website",
    imageWidth: 1200,
    imageHeight: 630
  }
};

// Get OG config for a given path (async for dynamic content)
export async function getOGConfig(path: string): Promise<OGConfig> {
  // Exact match first
  if (ogConfigs[path]) {
    return ogConfigs[path];
  }
  
  // Check for partial matches (for dynamic routes like /blog/slug)
  const pathParts = path.split('/').filter(Boolean);
  
  // For blog posts, fetch from database
  if (pathParts[0] === 'blog' && pathParts.length > 1) {
    const slug = pathParts[1];
    try {
      const post = await getBlogPostBySlug(slug);
      if (post) {
        return {
          title: `${post.title} | Umbrella Broadband Blog`,
          description: post.excerpt 
            ? post.excerpt.substring(0, 155) + (post.excerpt.length > 155 ? '...' : '')
            : `Read ${post.title} on Umbrella Broadband blog. Expert insights on connectivity and technology.`,
          image: post.imageUrl || "/images/og-image.jpg",
          type: "article",
          imageWidth: 1200,
          imageHeight: 630
        };
      }
    } catch (error) {
      console.error("[OG Config] Error fetching blog post:", error);
    }
    // Fallback for blog posts
    return {
      ...defaultOG,
      title: "Blog | Umbrella Broadband",
      type: "article"
    };
  }
  
  // For case study details, fetch from database
  if (pathParts[0] === 'case-studies' && pathParts.length > 1) {
    const slug = pathParts[1];
    try {
      const caseStudy = await getCaseStudyBySlug(slug);
      if (caseStudy) {
        return {
          title: `${caseStudy.title} | ${caseStudy.clientName} Case Study | Umbrella Broadband`,
          description: caseStudy.challenge 
            ? caseStudy.challenge.substring(0, 155) + '...'
            : `Discover how Umbrella Broadband helped ${caseStudy.clientName} achieve reliable connectivity. Read the full case study.`,
          image: caseStudy.imageUrl || "/images/og-image.jpg",
          type: "article",
          imageWidth: 1200,
          imageHeight: 630
        };
      }
    } catch (error) {
      console.error("[OG Config] Error fetching case study:", error);
    }
    // Fallback for case studies
    return {
      ...defaultOG,
      title: "Case Study | Umbrella Broadband",
      type: "article"
    };
  }
  
  return defaultOG;
}

// Generate OG meta tags HTML with all required fields for social media crawlers
export function generateOGMetaTags(config: OGConfig, path: string, baseUrl: string): string {
  const image = config.image || '/images/og-image.jpg';
  const imageUrl = image.startsWith('http') 
    ? image 
    : `${baseUrl}${image}`;
  const pageUrl = `${baseUrl}${path}`;
  const imageWidth = config.imageWidth || 1200;
  const imageHeight = config.imageHeight || 630;
  
  return `
    <!-- Open Graph / Facebook -->
    <link rel="canonical" href="${pageUrl}" />
    <meta property="og:type" content="${config.type || 'website'}" />
    <meta property="og:site_name" content="Umbrella Broadband" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:title" content="${escapeHtml(config.title)}" />
    <meta property="og:description" content="${escapeHtml(config.description)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:width" content="${imageWidth}" />
    <meta property="og:image:height" content="${imageHeight}" />
    <meta property="og:image:alt" content="${escapeHtml(config.title)}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(config.title)}" />
    <meta name="twitter:description" content="${escapeHtml(config.description)}" />
    <meta name="twitter:image" content="${imageUrl}" />`;
}

// Helper to escape HTML entities in meta content
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
