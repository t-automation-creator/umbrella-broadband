import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { generateOGMetaTags } from "./og-config";

// Get base URL from environment or request
function getBaseUrl(req: express.Request): string {
  // In production, use the actual domain
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'umbrella-broadband.co.uk';
  return `${protocol}://${host}`;
}

// Inject dynamic OG meta tags into HTML
function injectOGMetaTags(html: string, path: string, baseUrl: string): string {
  const ogTags = generateOGMetaTags(path, baseUrl);
  
  // Replace the existing OG meta tags block
  const ogStartMarker = '<!-- Open Graph / Facebook -->';
  const twitterEndMarker = '<meta name="twitter:image"';
  
  // Find and replace the OG tags section
  const ogStartIndex = html.indexOf(ogStartMarker);
  if (ogStartIndex !== -1) {
    // Find the end of the twitter:image tag
    const twitterImageIndex = html.indexOf(twitterEndMarker, ogStartIndex);
    if (twitterImageIndex !== -1) {
      // Find the closing > of the twitter:image tag
      const closingIndex = html.indexOf('/>', twitterImageIndex);
      if (closingIndex !== -1) {
        const beforeOG = html.substring(0, ogStartIndex);
        const afterOG = html.substring(closingIndex + 2);
        return beforeOG + ogTags + afterOG;
      }
    }
  }
  
  // Fallback: insert before </head> if markers not found
  return html.replace('</head>', `${ogTags}\n  </head>`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      
      // Inject dynamic OG meta tags based on the URL
      const baseUrl = getBaseUrl(req);
      template = injectOGMetaTags(template, url, baseUrl);
      
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    let html = fs.readFileSync(indexPath, "utf-8");
    
    // Inject dynamic OG meta tags for production
    const baseUrl = getBaseUrl(req);
    html = injectOGMetaTags(html, req.originalUrl, baseUrl);
    
    res.set({ "Content-Type": "text/html" }).send(html);
  });
}
