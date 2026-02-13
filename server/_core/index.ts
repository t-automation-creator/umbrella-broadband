import "dotenv/config";
import "../logger"; // Initialize logging
import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { startValidationScheduler } from "../services/validation-scheduler";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
// import { generateSitemap } from "./sitemap"; // Disabled: using static sitemap.xml instead

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // DEBUG: Log the API key at startup
  const apiKey = process.env.RESEND_API_KEY;
  console.log("[STARTUP DEBUG] RESEND_API_KEY:", apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : "NOT SET");
  console.log("[STARTUP DEBUG] API Key starts with 're_':", apiKey?.startsWith('re_') ? 'YES' : 'NO');
  const app = express();
  app.disable('x-powered-by'); // Disable Express signature
  const server = createServer(app);

  // CRITICAL: Sitemap route MUST be registered FIRST, before ANY other middleware,
  // to override the platform's auto-generated sitemap that includes admin pages.
  const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://umbrella-broadband.co.uk/</loc><lastmod>2026-02-13</lastmod></url>
  <url><loc>https://umbrella-broadband.co.uk/about</loc><lastmod>2026-02-13</lastmod></url>
  <url><loc>https://umbrella-broadband.co.uk/sectors</loc><lastmod>2026-02-13</lastmod></url>
  <url><loc>https://umbrella-broadband.co.uk/solutions</loc><lastmod>2026-02-13</lastmod></url>
  <url><loc>https://umbrella-broadband.co.uk/services</loc><lastmod>2026-02-13</lastmod></url>
  <url><loc>https://umbrella-broadband.co.uk/starlink</loc><lastmod>2026-02-13</lastmod></url>
  <url><loc>https://umbrella-broadband.co.uk/managed-broadband</loc><lastmod>2026-02-13</lastmod></url>
  <url><loc>https://umbrella-broadband.co.uk/voip</loc><lastmod>2026-02-13</lastmod></url>
  <url><loc>https://umbrella-broadband.co.uk/cctv</loc><lastmod>2026-02-13</lastmod></url>
  <url><loc>https://umbrella-broadband.co.uk/access-control</loc><lastmod>2026-02-13</lastmod></url>
  <url><loc>https://umbrella-broadband.co.uk/contact</loc><lastmod>2026-02-13</lastmod></url>
  <url><loc>https://umbrella-broadband.co.uk/support</loc><lastmod>2026-02-13</lastmod></url>
  <url><loc>https://umbrella-broadband.co.uk/case-studies</loc><lastmod>2026-02-13</lastmod></url>
  <url><loc>https://umbrella-broadband.co.uk/blog</loc><lastmod>2026-02-13</lastmod></url>
</urlset>`;

  app.get('/sitemap.xml', (_req, res) => {
    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(SITEMAP_XML);
  });
  
  // Start URL validation scheduler
  startValidationScheduler(24 * 60); // Run validation once per day (1440 minutes)
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Parse cookies for session management
  app.use(cookieParser());
  
  // Security headers middleware
  app.use((req, res, next) => {
    // Content Security Policy - prevents XSS attacks
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://maps.googleapis.com; frame-src 'self';"
    );
    
    // Strict-Transport-Security - enforces HTTPS
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
    
    // X-Content-Type-Options - prevents MIME sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");
    
    // X-Frame-Options - prevents clickjacking
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    
    // X-XSS-Protection - enables XSS filter in older browsers
    res.setHeader("X-XSS-Protection", "1; mode=block");
    
    // Referrer-Policy - controls referrer information
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    
    // Permissions-Policy - restricts browser features
    res.setHeader(
      "Permissions-Policy",
      "geolocation=(self), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
    );
    
    // Remove X-Powered-By header to hide server information
    res.removeHeader("X-Powered-By");
    
    // Cross-Origin-Opener-Policy - prevents cross-origin attacks
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    
    // Cross-Origin-Resource-Policy - restricts resource loading
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    
    // Cross-Origin-Embedder-Policy - enables cross-origin isolation
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    
    // Expect-CT - certificate transparency (deprecated but still useful)
    res.setHeader("Expect-CT", "max-age=86400, enforce");
    
    next();
  });
  
  // Note: Sitemap is handled by the early route registered at the top of startServer()
  
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  
  // Note: Sitemap route is defined above and takes precedence over static file serving
  
  // 404 handler for undefined routes (before error handler)
  app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ error: 'Not found' });
  });
  
  // Error handling middleware - sanitize error messages in production
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Log the full error for debugging
    console.error('[ERROR]', err);
    
    // In production, send generic error message
    if (process.env.NODE_ENV === 'production') {
      res.status(err.status || 500).json({
        error: 'An error occurred while processing your request',
        message: 'Please try again later or contact support if the problem persists'
      });
    } else {
      // In development, send detailed error for debugging
      res.status(err.status || 500).json({
        error: err.message,
        stack: err.stack
      });
    }
  });

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
