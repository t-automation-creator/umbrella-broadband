// Open Graph configuration for each page
// This is used by the server to inject the correct OG meta tags for social media crawlers

export interface OGConfig {
  title: string;
  description: string;
  image: string;
  type?: string;
}

// Default OG config
const defaultOG: OGConfig = {
  title: "Umbrella Broadband | Managed Connectivity Solutions",
  description: "Umbrella Broadband provides fully managed broadband, VoIP, and security solutions for landlords, businesses, and developers across the UK.",
  image: "/images/og-image.jpg",
  type: "website"
};

// Page-specific OG configurations
export const ogConfigs: Record<string, OGConfig> = {
  "/": {
    title: "Umbrella Broadband | Managed Connectivity",
    description: "Umbrella Broadband provides fast, reliable, and secure connectivity solutions for landlords, businesses, and developers. Fully managed networks you can trust.",
    image: "/images/hero-aerial-v14.jpg",
    type: "website"
  },
  "/about": {
    title: "About Umbrella Broadband | UK Connectivity Experts",
    description: "Learn about Umbrella Broadband's mission to deliver seamless, high-speed internet and security solutions. We are dedicated to keeping you connected.",
    image: "/images/about-hero.jpg",
    type: "website"
  },
  "/sectors": {
    title: "Sectors We Serve | Umbrella Broadband Solutions",
    description: "Tailored broadband and security solutions for Landlords, Developers, Businesses, and Student Accommodation. Find the right fit for your sector.",
    image: "/images/sectors-hero-desktop.jpg",
    type: "website"
  },
  "/solutions": {
    title: "Solutions | Umbrella Broadband",
    description: "Explore our comprehensive range of services including Managed Broadband, VoIP Telephony, CCTV Security, and Management Services.",
    image: "/images/og-image.jpg",
    type: "website"
  },
  "/solutions/managed-broadband": {
    title: "Managed Broadband | Umbrella Broadband",
    description: "Fully managed broadband for businesses and landlords. High-speed fibre, 24/7 monitoring, and dedicated UK support.",
    image: "/images/solutions/broadband-hero-desktop.jpg",
    type: "website"
  },
  "/solutions/voip": {
    title: "VoIP Phone Systems | Umbrella Broadband",
    description: "Cloud-based VoIP phone systems for businesses. Reduce costs, work from anywhere, and get enterprise features at SME prices. Hosted telephony with UK support.",
    image: "/images/solutions/voip-hero-desktop.jpg",
    type: "website"
  },
  "/solutions/cctv": {
    title: "CCTV & Security Systems | Umbrella Broadband",
    description: "Professional CCTV installation and monitoring for UK businesses. HD cameras, cloud recording, remote viewing, and 24/7 support.",
    image: "/images/solutions/cctv-hero-desktop.jpg",
    type: "website"
  },
  "/solutions/access-control": {
    title: "Access Control Solutions | Umbrella Broadband",
    description: "Professional access control and intercom installation for UK businesses. Keyless entry, video intercoms, and biometric systems.",
    image: "/images/solutions/access-control-hero-desktop.jpg",
    type: "website"
  },
  "/solutions/starlink": {
    title: "Managed Starlink Services | Umbrella Broadband",
    description: "Professional Starlink installation and management for UK businesses. Emergency backup, rural connectivity, and events with 24/7 support.",
    image: "/images/solutions/starlink-hero-desktop.jpg",
    type: "website"
  },
  "/case-studies": {
    title: "Case Studies | Umbrella Broadband Success Stories",
    description: "Discover how Umbrella Broadband has helped businesses and organizations achieve reliable, high-speed connectivity. Read our client success stories.",
    image: "/images/og-image.jpg",
    type: "website"
  },
  "/blog": {
    title: "Blog | Latest News & Insights | Umbrella Broadband",
    description: "Stay updated with the latest news, industry trends, and insights from Umbrella Broadband. Read our blog for expert advice.",
    image: "/images/og-image.jpg",
    type: "website"
  },
  "/contact": {
    title: "Contact Umbrella Broadband | Get in Touch Today",
    description: "Get in touch with Umbrella Broadband for expert advice on your connectivity needs. Call us, email us, or visit our office in Leamington Spa.",
    image: "/images/og-image.jpg",
    type: "website"
  }
};

// Get OG config for a given path
export function getOGConfig(path: string): OGConfig {
  // Exact match first
  if (ogConfigs[path]) {
    return ogConfigs[path];
  }
  
  // Check for partial matches (for dynamic routes like /blog/slug)
  const pathParts = path.split('/').filter(Boolean);
  
  // For blog posts, use blog default
  if (pathParts[0] === 'blog' && pathParts.length > 1) {
    return {
      ...defaultOG,
      title: "Blog | Umbrella Broadband",
      type: "article"
    };
  }
  
  // For case study details, use case studies default
  if (pathParts[0] === 'case-studies' && pathParts.length > 1) {
    return {
      ...defaultOG,
      title: "Case Study | Umbrella Broadband",
      type: "article"
    };
  }
  
  return defaultOG;
}

// Generate OG meta tags HTML
export function generateOGMetaTags(path: string, baseUrl: string): string {
  const config = getOGConfig(path);
  const imageUrl = config.image.startsWith('http') 
    ? config.image 
    : `${baseUrl}${config.image}`;
  const pageUrl = `${baseUrl}${path}`;
  
  return `
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${config.type || 'website'}" />
    <meta property="og:site_name" content="Umbrella Broadband" />
    <meta property="og:title" content="${config.title}" />
    <meta property="og:description" content="${config.description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:url" content="${pageUrl}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${config.title}" />
    <meta name="twitter:description" content="${config.description}" />
    <meta name="twitter:image" content="${imageUrl}" />`;
}
