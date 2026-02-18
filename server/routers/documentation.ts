import { router, publicProcedure, adminProcedure } from "../_core/trpc";
import { z } from "zod";

/**
 * Documentation module - searchable handover documentation
 * Auto-updates when site content changes
 */

// In-memory documentation store (cost-effective alternative to database)
// In production, this would be loaded from database on startup
const documentationStore = {
  "core-pages": {
    title: "Core Pages",
    items: [
      { name: "Homepage", url: "/", description: "Main landing page with aerial hero image, property types, feature cards, statistics, testimonials, case studies, partner logos", keywords: ["homepage", "landing", "main page"] },
      { name: "About Us", url: "/about", description: "Company mission, vision, values, team information, and service approach", keywords: ["about", "company", "mission", "vision"] },
      { name: "Contact Us", url: "/contact", description: "Contact form, company phone (01926 298 378), email, location (Leamington Spa, Warwickshire)", keywords: ["contact", "phone", "location", "form"] },
      { name: "Support", url: "/support", description: "Fault-reporting for existing customers with address lookup and issue description", keywords: ["support", "fault", "help", "issue"] },
      { name: "Privacy Policy", url: "/privacy-policy", description: "Privacy and data protection policy for legal compliance", keywords: ["privacy", "policy", "gdpr", "data"] }
    ]
  },
  "solutions": {
    title: "Solutions Pages",
    items: [
      { name: "Solutions Overview", url: "/solutions", description: "Directory of six offerings", keywords: ["solutions", "services", "offerings"] },
      { name: "Managed Broadband", url: "/managed-broadband", description: "Core service for Student, Commercial, HMO, Residential properties", keywords: ["broadband", "internet", "connectivity"] },
      { name: "VoIP Phone Systems", url: "/voip", description: "Cloud-based business phones with call forwarding, voicemail-to-email", keywords: ["voip", "phone", "telephony", "business"] },
      { name: "CCTV & Security", url: "/cctv", description: "Professional CCTV, HD cameras, cloud recording, remote viewing", keywords: ["cctv", "security", "camera", "surveillance"] },
      { name: "Access Control", url: "/access-control", description: "Keyless entry, video intercoms, biometric security", keywords: ["access control", "intercom", "keyless", "security"] },
      { name: "Managed Starlink", url: "/starlink", description: "Satellite internet for rural areas, emergency backup, events", keywords: ["starlink", "satellite", "rural", "backup"] }
    ]
  },
  "content-pages": {
    title: "Dynamic Content Pages",
    items: [
      { name: "Blog", url: "/blog", description: "Published articles with title, excerpt, author, date, featured image", keywords: ["blog", "articles", "news", "insights"] },
      { name: "Blog Post", url: "/blog/:slug", description: "Full article with rich-text content, related posts, CTA", keywords: ["blog", "article", "post"] },
      { name: "Case Studies", url: "/case-studies", description: "Gallery of successful client projects", keywords: ["case studies", "projects", "success stories"] },
      { name: "Case Study", url: "/case-studies/:slug", description: "Detailed project with Challenge, Solution, Results, client quote", keywords: ["case study", "project", "results"] }
    ]
  },
  "chatbot": {
    title: "AI Chatbot System",
    content: "AI-powered chatbot detects user intent and routes to: Quote Requests (sales), Callback Requests (sales), Support Tickets (support team), or general conversation. All interactions logged and trigger email notifications.",
    keywords: ["chatbot", "ai", "support", "quotes", "leads"]
  },
  "admin-panel": {
    title: "Admin Panel Features",
    content: "Content management system at /admin/login. Includes: blog editor, case study management, contact inquiry tracking, chat lead monitoring, admin account management, settings configuration.",
    keywords: ["admin", "dashboard", "cms", "management", "content"]
  },
  "email-system": {
    title: "Email Routing",
    content: "Sales inquiries (quotes, contacts, callbacks) → enquiries@umbrella-broadband.co.uk (CC: gavin@). Support tickets → support@umbrella-broadband.co.uk (CC: gavin@, Tyler@). All customers receive auto-reply confirmations from respective sender address.",
    keywords: ["email", "notifications", "routing", "sales", "support"]
  },
  "seo": {
    title: "SEO & Search Visibility",
    content: "XML sitemap for search engine indexing, robots.txt for crawler instructions, analytics tracking for visitor behavior and conversions. Admin routes excluded from sitemap.",
    keywords: ["seo", "search", "sitemap", "analytics", "visibility"]
  },
  "integrations": {
    title: "Third-Party Integrations",
    items: [
      { service: "Resend", purpose: "Email delivery and notifications", keywords: ["resend", "email"] },
      { service: "Google Maps", purpose: "Location services and address lookup", keywords: ["maps", "location", "address"] },
      { service: "LLM API", purpose: "AI chatbot intelligence", keywords: ["llm", "ai", "chatbot"] },
      { service: "OAuth", purpose: "Admin authentication", keywords: ["oauth", "auth", "login"] },
      { service: "S3 Storage", purpose: "File and media storage", keywords: ["s3", "storage", "files"] }
    ]
  },
  "database": {
    title: "Database Structure",
    content: "Stores: blog posts, case studies, contact inquiries, chat interactions, admin sessions, admin accounts. All timestamps in UTC. Automatic indexing for search performance.",
    keywords: ["database", "storage", "schema", "tables"]
  },
  "key-contacts": {
    title: "Key Contacts & Accounts",
    items: [
      { role: "Business Owner", name: "Gavin", email: "gavin@umbrella-broadband.co.uk", keywords: ["gavin", "owner", "contact"] },
      { role: "Support Team", email: "support@umbrella-broadband.co.uk", keywords: ["support", "team"] },
      { role: "Sales Inquiries", email: "enquiries@umbrella-broadband.co.uk", keywords: ["sales", "enquiries"] },
      { role: "Company Phone", number: "01926 298 378", keywords: ["phone", "contact"] },
      { role: "Location", address: "Leamington Spa, Warwickshire", keywords: ["location", "address"] }
    ]
  }
};

export const documentationRouter = router({
  // Get all documentation sections
  getAll: publicProcedure.query(async () => {
    return Object.entries(documentationStore).map(([id, section]) => ({
      id,
      ...section
    }));
  }),

  // Search documentation by keyword
  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      const query = input.query.toLowerCase();
      const results: any[] = [];

      Object.entries(documentationStore).forEach(([id, section]) => {
        // Search in title
        if (section.title.toLowerCase().includes(query)) {
          results.push({ id, type: "section", ...section, matchType: "title" });
        }

        // Search in content
        if ('content' in section && section.content && (section.content as string).toLowerCase().includes(query)) {
          results.push({ id, type: "section", ...section, matchType: "content" });
        }

        // Search in keywords
        if ('keywords' in section && section.keywords) {
          const keywordMatch = (section.keywords as string[]).some((k: string) => k.toLowerCase().includes(query));
          if (keywordMatch) {
            results.push({ id, type: "section", ...section, matchType: "keyword" });
          }
        }

        // Search in items (for sections with items array)
        if ('items' in section && section.items && Array.isArray(section.items)) {
          (section.items as any[]).forEach((item: any, idx: number) => {
            const itemMatches = 
              (item.name && item.name.toLowerCase().includes(query)) ||
              (item.description && item.description.toLowerCase().includes(query)) ||
              (item.keywords && item.keywords.some((k: string) => k.toLowerCase().includes(query))) ||
              (item.service && item.service.toLowerCase().includes(query)) ||
              (item.purpose && item.purpose.toLowerCase().includes(query)) ||
              (item.email && item.email.toLowerCase().includes(query));

            if (itemMatches) {
              results.push({
                id,
                type: "item",
                sectionTitle: section.title,
                item,
                itemIndex: idx
              });
            }
          });
        }
      });

      // Deduplicate and return top 20 results
      const unique = Array.from(new Map(results.map(r => [JSON.stringify(r), r])).values());
      return unique.slice(0, 20);
    }),

  // Get specific section
  getSection: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const section = documentationStore[input.id as keyof typeof documentationStore];
      if (!section) {
        throw new Error("Section not found");
      }
      return { id: input.id, ...section };
    }),

  // Admin: Update documentation (triggered by site changes)
  updateSection: adminProcedure
    .input(z.object({
      id: z.string(),
      title: z.string(),
      content: z.string().optional(),
      items: z.any().optional(),
      keywords: z.array(z.string()).optional()
    }))
    .mutation(async ({ input }) => {
      documentationStore[input.id as keyof typeof documentationStore] = {
        title: input.title,
        content: input.content,
        items: input.items,
        keywords: input.keywords
      } as any;
      return { success: true, id: input.id };
    })
});
