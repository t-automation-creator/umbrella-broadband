// Comprehensive documentation content extracted from handover document
export const documentationContent = [
  {
    id: "intro",
    title: "Introduction & Purpose",
    category: "Overview",
    content: "This is the complete handover guide for the Umbrella Broadband website (www.umbrella-broadband.co.uk). The website serves as the company's primary digital presence, designed to attract customers, showcase services, capture sales leads, provide customer support, and publish SEO content.",
    keywords: ["overview", "purpose", "handover", "website"],
  },
  {
    id: "pages-core",
    title: "Core Website Pages",
    category: "Pages",
    items: [
      {
        name: "Homepage",
        url: "/",
        description: "Main landing page with hero image showing property types (Student, Commercial, HMO, Residential). Features animated statistics, four feature cards (Connectivity, Security, Communication, Support), sector tailoring section, testimonials carousel, case study previews, and partner logos.",
        keywords: ["homepage", "landing", "hero"],
      },
      {
        name: "About Us",
        url: "/about",
        description: "Company introduction with mission, vision, values, team information, and service approach.",
        keywords: ["about", "company", "team"],
      },
      {
        name: "Contact Us",
        url: "/contact",
        description: "Contact form (name, email, phone, company, message), phone number (01926 298 378), email, and business location (Leamington Spa, Warwickshire). Submissions saved to database and trigger email notifications.",
        keywords: ["contact", "form", "location"],
      },
      {
        name: "Support",
        url: "/support",
        description: "Fault-reporting page for existing customers. Fields: name, email, phone, postcode (with auto address lookup), street name, house number, issue description. Submissions emailed to support team.",
        keywords: ["support", "fault", "reporting"],
      },
      {
        name: "Privacy Policy",
        url: "/privacy-policy",
        description: "Legal privacy and data protection policy for compliance.",
        keywords: ["privacy", "policy", "legal"],
      },
    ],
    keywords: ["pages", "core", "navigation"],
  },
  {
    id: "pages-solutions",
    title: "Solutions Pages",
    category: "Pages",
    items: [
      {
        name: "Solutions Overview",
        url: "/solutions",
        description: "Directory page with cards for six offerings: Managed Broadband, VoIP Phone Systems, CCTV & Security, Access Control, Managed Starlink, Management Services.",
        keywords: ["solutions", "overview", "directory"],
      },
      {
        name: "Managed Broadband",
        url: "/managed-broadband",
        description: "Core broadband service details including features, benefits, and property type applications.",
        keywords: ["broadband", "managed", "connectivity"],
      },
      {
        name: "VoIP Phone Systems",
        url: "/voip",
        description: "Cloud-based business phone systems with call forwarding, voicemail-to-email, mobile apps.",
        keywords: ["voip", "phone", "communication"],
      },
      {
        name: "CCTV & Security",
        url: "/cctv",
        description: "Professional CCTV installation, HD cameras, cloud recording, remote viewing.",
        keywords: ["cctv", "security", "cameras"],
      },
      {
        name: "Access Control",
        url: "/access-control",
        description: "Keyless entry, video intercoms, biometric security systems.",
        keywords: ["access", "control", "security"],
      },
      {
        name: "Managed Starlink",
        url: "/starlink",
        description: "Satellite internet service for rural connectivity, emergency backup, and event solutions.",
        keywords: ["starlink", "satellite", "rural"],
      },
    ],
    keywords: ["solutions", "services", "pages"],
  },
  {
    id: "content-pages",
    title: "Content & Blog Pages",
    category: "Pages",
    items: [
      {
        name: "Blog",
        url: "/blog",
        description: "Dynamic blog with published articles for SEO and thought leadership. Articles are managed in the admin panel and can be published/unpublished. Each article has title, slug, excerpt, content, category, featured image, and author.",
        keywords: ["blog", "content", "articles"],
      },
      {
        name: "Case Studies",
        url: "/case-studies",
        description: "Showcase of successful client projects with detailed information about challenges, solutions, and results. Managed through admin panel.",
        keywords: ["case studies", "projects", "success"],
      },
    ],
    keywords: ["content", "blog", "articles"],
  },
  {
    id: "chatbot",
    title: "AI Chatbot System",
    category: "Features",
    content: "The website features an AI-powered chatbot that handles customer inquiries 24/7. The chatbot can recognize customer intent and route conversations appropriately.",
    items: [
      {
        name: "Quote Requests",
        description: "Customers can request quotes for services. The chatbot collects information and routes to sales team.",
        keywords: ["quote", "sales", "inquiry"],
      },
      {
        name: "Callback Requests",
        description: "Customers can request a callback from the sales team at a convenient time.",
        keywords: ["callback", "scheduling", "sales"],
      },
      {
        name: "Support Tickets",
        description: "Existing customers can report issues and get support assistance.",
        keywords: ["support", "ticket", "help"],
      },
      {
        name: "General Chat",
        description: "The chatbot can answer general questions about services and company.",
        keywords: ["chat", "questions", "information"],
      },
    ],
    keywords: ["chatbot", "ai", "customer service"],
  },
  {
    id: "admin-panel",
    title: "Admin Panel - Content Management",
    category: "Admin",
    content: "The admin panel is a secure backend system for managing website content, customer inquiries, and business operations. Access requires username and password authentication.",
    items: [
      {
        name: "Dashboard",
        description: "Overview of recent activity, key metrics, and quick access to main functions.",
        keywords: ["dashboard", "overview", "metrics"],
      },
      {
        name: "Blog Management",
        description: "Create, edit, publish, and delete blog posts. Each post has title, slug, excerpt, content, category, featured image, and author field.",
        keywords: ["blog", "posts", "content"],
      },
      {
        name: "Case Studies",
        description: "Manage case study content with title, description, featured image, and results.",
        keywords: ["case studies", "projects"],
      },
      {
        name: "Contact Inquiries",
        description: "View all contact form submissions, mark as read, and manage customer inquiries.",
        keywords: ["contacts", "inquiries", "submissions"],
      },
      {
        name: "Chat Leads",
        description: "View all chatbot conversations and leads from quote requests, callbacks, and support tickets.",
        keywords: ["chat", "leads", "conversations"],
      },
      {
        name: "Admin Accounts",
        description: "Create, edit, and delete admin user accounts. Manage who has access to the admin panel.",
        keywords: ["admin", "accounts", "users"],
      },
      {
        name: "Settings",
        description: "Configure website settings, email addresses, and system preferences.",
        keywords: ["settings", "configuration"],
      },
      {
        name: "Documentation",
        description: "Searchable knowledge base with all handover information, system details, and operational guides.",
        keywords: ["documentation", "knowledge", "help"],
      },
    ],
    keywords: ["admin", "panel", "management"],
  },
  {
    id: "email-system",
    title: "Email System & Notifications",
    category: "Technical",
    content: "The website uses Resend (email service) to send automated notifications and customer confirmations.",
    items: [
      {
        name: "Sales Inquiries",
        description: "Contact form, quote requests, and callback requests are sent to enquiries@umbrella-broadband.co.uk with CC to gavin@umbrella-broadband.co.uk",
        keywords: ["sales", "email", "notifications"],
      },
      {
        name: "Support Tickets",
        description: "Support inquiries are sent to support@umbrella-broadband.co.uk with CC to gavin@ and Tyler@",
        keywords: ["support", "email", "tickets"],
      },
      {
        name: "Customer Confirmations",
        description: "Automatic confirmation emails sent to customers when they submit forms or inquiries.",
        keywords: ["confirmation", "customer", "email"],
      },
    ],
    keywords: ["email", "notifications", "resend"],
  },
  {
    id: "external-redirects",
    title: "External Redirects & Links",
    category: "Technical",
    items: [
      {
        name: "LinkedIn",
        description: "Company LinkedIn profile link",
        url: "https://www.linkedin.com/company/umbrella-broadband",
        keywords: ["social", "linkedin"],
      },
      {
        name: "Twitter/X",
        description: "Company Twitter/X profile link",
        url: "https://twitter.com/umbrellabroadband",
        keywords: ["social", "twitter"],
      },
    ],
    keywords: ["redirects", "external", "links"],
  },
  {
    id: "seo",
    title: "Search Engine Optimization (SEO)",
    category: "Technical",
    content: "The website is optimized for search engines with proper meta tags, structured data, and SEO-friendly URLs. Blog posts and case studies are indexed for organic search visibility.",
    items: [
      {
        name: "Meta Tags",
        description: "Each page has optimized title tags and meta descriptions for search results.",
        keywords: ["meta", "tags", "seo"],
      },
      {
        name: "Sitemap",
        description: "XML sitemap at /sitemap.xml lists all public pages for search engine crawling. Admin routes are excluded.",
        keywords: ["sitemap", "xml", "crawling"],
      },
      {
        name: "Robots.txt",
        description: "File at /robots.txt controls which pages search engines can crawl.",
        keywords: ["robots", "crawling"],
      },
      {
        name: "Blog Content",
        description: "Blog posts are published with SEO-friendly slugs and are indexed by search engines.",
        keywords: ["blog", "content", "indexing"],
      },
    ],
    keywords: ["seo", "search", "optimization"],
  },
  {
    id: "analytics",
    title: "Analytics & Tracking",
    category: "Technical",
    content: "Website traffic and user behavior is tracked using analytics services to understand visitor patterns and optimize marketing.",
    keywords: ["analytics", "tracking", "metrics"],
  },
  {
    id: "database",
    title: "Database - Stored Information",
    category: "Technical",
    content: "The website stores customer data, inquiries, and content in a secure database.",
    items: [
      {
        name: "Contact Submissions",
        description: "Name, email, phone, company, message from contact form submissions.",
        keywords: ["contacts", "submissions"],
      },
      {
        name: "Chat Leads",
        description: "Chatbot conversations including quote requests, callbacks, and support tickets.",
        keywords: ["chat", "leads"],
      },
      {
        name: "Blog Posts",
        description: "Published and draft blog articles with content, images, and metadata.",
        keywords: ["blog", "posts"],
      },
      {
        name: "Case Studies",
        description: "Case study content and project information.",
        keywords: ["case studies"],
      },
      {
        name: "Admin Sessions",
        description: "Secure session tokens for admin panel access.",
        keywords: ["admin", "sessions"],
      },
    ],
    keywords: ["database", "storage", "data"],
  },
  {
    id: "integrations",
    title: "Third-Party Services & Integrations",
    category: "Technical",
    items: [
      {
        name: "Resend",
        description: "Email service provider for sending customer notifications and confirmations. Domain umbrella-broadband.co.uk is verified.",
        keywords: ["email", "resend", "service"],
      },
      {
        name: "Google Maps",
        description: "Embedded maps on the website for location information.",
        keywords: ["maps", "location"],
      },
      {
        name: "Analytics Service",
        description: "Website traffic tracking and visitor analytics.",
        keywords: ["analytics", "tracking"],
      },
    ],
    keywords: ["integrations", "services", "third-party"],
  },
  {
    id: "environment",
    title: "Environment Configuration",
    category: "Technical",
    content: "The website runs in a production environment with secure configuration for database, email, and authentication services.",
    keywords: ["environment", "configuration", "production"],
  },
  {
    id: "tech-stack",
    title: "Technology Stack",
    category: "Technical",
    items: [
      {
        name: "Frontend",
        description: "React 19 with TypeScript for interactive user interface",
        keywords: ["react", "frontend"],
      },
      {
        name: "Backend",
        description: "Express.js server with tRPC for type-safe API calls",
        keywords: ["express", "backend", "trpc"],
      },
      {
        name: "Database",
        description: "MySQL database with Drizzle ORM for data management",
        keywords: ["mysql", "database"],
      },
      {
        name: "Styling",
        description: "Tailwind CSS for responsive design and styling",
        keywords: ["tailwind", "css", "styling"],
      },
      {
        name: "Deployment",
        description: "Hosted on Manus platform with automatic scaling and SSL",
        keywords: ["deployment", "hosting"],
      },
    ],
    keywords: ["technology", "stack", "tech"],
  },
  {
    id: "performance",
    title: "Performance Optimizations",
    category: "Technical",
    content: "The website is optimized for fast loading and smooth user experience with image optimization, caching, and efficient code.",
    keywords: ["performance", "optimization", "speed"],
  },
  {
    id: "known-issues",
    title: "Known Issues & Outstanding Items",
    category: "Maintenance",
    content: "Monitor for any reported issues or items that need attention. Check the admin panel regularly for new inquiries and feedback.",
    keywords: ["issues", "maintenance", "outstanding"],
  },
  {
    id: "contacts",
    title: "Key Contacts & Accounts",
    category: "Admin",
    items: [
      {
        name: "Sales Email",
        description: "enquiries@umbrella-broadband.co.uk - For sales inquiries and quotes",
        keywords: ["email", "sales"],
      },
      {
        name: "Support Email",
        description: "support@umbrella-broadband.co.uk - For customer support and technical issues",
        keywords: ["email", "support"],
      },
      {
        name: "Phone",
        description: "01926 298 378 - Main business phone number",
        keywords: ["phone", "contact"],
      },
      {
        name: "Location",
        description: "Leamington Spa, Warwickshire - Business location",
        keywords: ["location", "address"],
      },
    ],
    keywords: ["contacts", "accounts", "information"],
  },
  {
    id: "summary",
    title: "Summary & Next Steps",
    category: "Overview",
    content: "The Umbrella Broadband website is a comprehensive digital platform with content management, customer communication, and business automation. Regular monitoring of the admin panel, email notifications, and analytics will help maintain and grow the business online presence.",
    keywords: ["summary", "overview", "next steps"],
  },
];
