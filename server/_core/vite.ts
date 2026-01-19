import fs from "fs";
import express, { type Request, type Response } from "express";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { getOGConfig, generateOGMetaTags } from "./og-config";

// Get base URL from environment or request
function getBaseUrl(req: express.Request): string {
  // In production, use the actual domain
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'umbrella-broadband.co.uk';
  return `${protocol}://${host}`;
}

// Inject dynamic OG meta tags into HTML
async function injectOGMetaTags(html: string, urlPath: string, baseUrl: string): Promise<string> {
  // Fetch OG config (may be async for dynamic content like blog posts)
  const config = await getOGConfig(urlPath);
  const ogTags = generateOGMetaTags(config, urlPath, baseUrl);
  
  // Replace the existing OG meta tags block
  const ogStartMarker = '<!-- Open Graph / Facebook -->';
  const schemaMarker = '<!-- Schema.org Structured Data';
  
  // Find and replace the OG tags section
  const ogStartIndex = html.indexOf(ogStartMarker);
  if (ogStartIndex !== -1) {
    // Find the start of the Schema.org comment (marks end of OG/Twitter section)
    const schemaIndex = html.indexOf(schemaMarker, ogStartIndex);
    if (schemaIndex !== -1) {
      const beforeOG = html.substring(0, ogStartIndex);
      const afterOG = html.substring(schemaIndex);
      return beforeOG + ogTags + '\n    ' + afterOG;
    }
  }
  
  // Fallback: insert before </head> if markers not found
  return html.replace('</head>', `${ogTags}\n  </head>`);
}

// Check if a request is for a static asset (not an HTML page)
function isStaticAsset(urlPath: string): boolean {
  const staticExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', 
    '.woff', '.woff2', '.ttf', '.eot', '.webp', '.mp4', '.webm',
    '.json', '.xml', '.txt', '.map', '.pdf'
  ];
  return staticExtensions.some(ext => urlPath.toLowerCase().endsWith(ext));
}

export async function setupVite(app: express.Application, server: Server) {
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
  
  // REST endpoint for postcode lookup - MUST be before catch-all route
  app.get('/api/postcode/lookup', async (req: Request, res: Response) => {
    try {
      const { postcode } = req.query;
      
      if (!postcode || typeof postcode !== 'string') {
        return res.status(400).json({ error: 'Postcode is required' });
      }
      
      const cleanPostcode = postcode.replace(/\s+/g, '');
      const response = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(cleanPostcode)}`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: 'Postcode not found' });
        }
        return res.status(500).json({ error: 'Unable to look up postcode' });
      }
      
      const data = await response.json();
      if (!data.result) {
        return res.status(404).json({ error: 'Postcode not found' });
      }
      
      const result = data.result;
      
      // Build address lines for display
      const addressLines = [];
      if (result.postcode) addressLines.push(result.postcode);
      if (result.parish) addressLines.push(result.parish);
      if (result.district) addressLines.push(result.district);
      if (result.region) addressLines.push(result.region);
      
      const address = addressLines.join(', ');
      
      res.json({
        postcode: result.postcode,
        address: address,
        addresses: [address], // Return as array for dropdown
        district: result.district,
        region: result.region,
        parish: result.parish,
      });
    } catch (error) {
      console.error('Postcode lookup error:', error);
      res.status(500).json({ error: 'Failed to look up postcode' });
    }
  });
  
  app.use("*", async (req: Request, res: Response, next: any) => {
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
      template = await injectOGMetaTags(template, url, baseUrl);
      
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
export function serveStatic(app: express.Application) {

  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../", "public")
      : path.resolve(import.meta.dirname, "public");
  
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // REST endpoint for postcode lookup - MUST be before catch-all routes
  app.get('/api/postcode/lookup', async (req: Request, res: Response) => {
    try {
      const { postcode } = req.query;
      
      if (!postcode || typeof postcode !== 'string') {
        return res.status(400).json({ error: 'Postcode is required' });
      }
      
      const cleanPostcode = postcode.replace(/\s+/g, '');
      const response = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(cleanPostcode)}`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: 'Postcode not found' });
        }
        return res.status(500).json({ error: 'Unable to look up postcode' });
      }
      
      const data = await response.json();
      if (!data.result) {
        return res.status(404).json({ error: 'Postcode not found' });
      }
      
      const result = data.result;
      
      // Build address lines for display
      const addressLines = [];
      if (result.postcode) addressLines.push(result.postcode);
      if (result.parish) addressLines.push(result.parish);
      if (result.district) addressLines.push(result.district);
      if (result.region) addressLines.push(result.region);
      
      const address = addressLines.join(', ');
      
      res.json({
        postcode: result.postcode,
        address: address,
        addresses: [address], // Return as array for dropdown
        district: result.district,
        region: result.region,
        parish: result.parish,
      });
    } catch (error) {
      console.error('Postcode lookup error:', error);
      res.status(500).json({ error: 'Failed to look up postcode' });
    }
  });

  // Catch-all route for SPA
  app.get("*", async (req: Request, res: Response) => {
    try {
      const indexPath = path.join(distPath, "index.html");
      
      if (!fs.existsSync(indexPath)) {
        return res.status(404).send("index.html not found");
      }

      let html = fs.readFileSync(indexPath, "utf-8");
      
      // Inject dynamic OG meta tags based on the URL
      const baseUrl = getBaseUrl(req);
      html = await injectOGMetaTags(html, req.originalUrl, baseUrl);
      
      res.set({ "Content-Type": "text/html" }).send(html);
    } catch (error) {
      console.error("Error serving static file:", error);
      res.status(500).send("Internal server error");
    }
  });
}
