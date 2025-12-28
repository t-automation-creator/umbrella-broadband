import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({ 
  title, 
  description, 
  keywords,
  image = "/images/og-image.jpg",
  url,
  type = "website"
}: SEOProps) {
  useEffect(() => {
    // Set document title (keep it under 60 characters)
    document.title = title;
    
    // Helper function to set or create meta tag
    const setMetaTag = (selector: string, attribute: string, value: string) => {
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (selector.includes('property=')) {
          meta.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
        } else if (selector.includes('name=')) {
          meta.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '');
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute(attribute, value);
    };
    
    // Set meta description
    setMetaTag('meta[name="description"]', 'content', description);

    // Set meta keywords
    if (keywords) {
      setMetaTag('meta[name="keywords"]', 'content', keywords);
    }
    
    // Set Open Graph tags
    setMetaTag('meta[property="og:title"]', 'content', title);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:type"]', 'content', type);
    if (image) {
      setMetaTag('meta[property="og:image"]', 'content', image);
    }
    if (url) {
      setMetaTag('meta[property="og:url"]', 'content', url);
    }
    
    // Set Twitter Card tags
    setMetaTag('meta[name="twitter:title"]', 'content', title);
    setMetaTag('meta[name="twitter:description"]', 'content', description);
    if (image) {
      setMetaTag('meta[name="twitter:image"]', 'content', image);
    }
  }, [title, description, keywords, image, url, type]);

  return null;
}
