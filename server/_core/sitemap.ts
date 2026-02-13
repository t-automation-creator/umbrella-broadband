/**
 * Sitemap generation module
 * Generates a clean, SEO-compliant sitemap excluding admin routes, redirects, and duplicates
 */

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

// Define all public pages with their metadata
const PAGES: SitemapURL[] = [
  {
    loc: 'https://umbrella-broadband.co.uk/',
    lastmod: '2026-02-10',
    changefreq: 'daily',
    priority: 1.0,
  },
  {
    loc: 'https://umbrella-broadband.co.uk/about',
    lastmod: '2026-01-15',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    loc: 'https://umbrella-broadband.co.uk/sectors',
    lastmod: '2026-01-20',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    loc: 'https://umbrella-broadband.co.uk/solutions',
    lastmod: '2026-01-18',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    loc: 'https://umbrella-broadband.co.uk/services',
    lastmod: '2026-02-05',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    loc: 'https://umbrella-broadband.co.uk/starlink',
    lastmod: '2026-01-25',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: 'https://umbrella-broadband.co.uk/managed-broadband',
    lastmod: '2026-02-01',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: 'https://umbrella-broadband.co.uk/voip',
    lastmod: '2026-01-28',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: 'https://umbrella-broadband.co.uk/cctv',
    lastmod: '2026-02-03',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: 'https://umbrella-broadband.co.uk/access-control',
    lastmod: '2026-02-02',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: 'https://umbrella-broadband.co.uk/contact',
    lastmod: '2026-02-09',
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    loc: 'https://umbrella-broadband.co.uk/support',
    lastmod: '2026-02-06',
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    loc: 'https://umbrella-broadband.co.uk/case-studies',
    lastmod: '2026-02-08',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: 'https://umbrella-broadband.co.uk/blog',
    lastmod: '2026-02-11',
    changefreq: 'weekly',
    priority: 0.7,
  },
];

/**
 * Generates a clean sitemap XML string
 * Excludes:
 * - Admin routes (/admin/*)
 * - Redirect pages (/support-redirect/, /Student-Cribs-Fault-Report/, etc.)
 * - Duplicate trailing-slash URLs
 * - API endpoints (/api/*)
 * - Legacy aliases (/about-us/)
 */
export function generateSitemap(): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const urlEntries = PAGES.map(page => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  return `${xmlHeader}\n${urlsetOpen}\n${urlEntries}\n${urlsetClose}\n`;
}

/**
 * Returns the list of public pages for the sitemap
 */
export function getSitemapPages(): SitemapURL[] {
  return PAGES;
}

/**
 * Checks if a URL should be excluded from the sitemap
 */
export function shouldExcludeFromSitemap(url: string): boolean {
  // Exclude admin routes
  if (url.includes('/admin')) return true;

  // Exclude redirect pages
  const redirectPages = [
    '/support-redirect/',
    '/Student-Cribs-Fault-Report/',
    '/urbanrest-support-redirect/',
    '/resooma-support-redirect/',
  ];
  if (redirectPages.some(redirect => url.includes(redirect))) return true;

  // Exclude API endpoints
  if (url.includes('/api/')) return true;

  // Exclude legacy aliases that redirect
  const legacyAliases = ['/about-us/', '/about-us'];
  if (legacyAliases.some(alias => url.includes(alias))) return true;

  return false;
}
