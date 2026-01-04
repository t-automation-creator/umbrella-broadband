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
  const server = createServer(app);
  
  // Start URL validation scheduler
  startValidationScheduler(30); // Run validation every 30 minutes
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Parse cookies for session management
  app.use(cookieParser());
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // Redirect routes MUST be registered BEFORE Vite/static middleware
  app.get("/support-redirect/", (req, res) => {
    res.redirect("https://forms.monday.com/forms/236f7d6c52a0be10dd9a6541dfc318e9?r=use1");
  });
  
  app.get("/Student-Cribs-Fault-Report/", (req, res) => {
    res.redirect("https://wkf.ms/4dfAxf7");
  });
  
  app.get("/urbanrest-support-redirect/", (req, res) => {
    res.redirect("https://forms.monday.com/forms/354bc6605fbffcfc231c6c54b88c69e9?r=use1");
  });
  
  app.get("/resooma-support-redirect/", (req, res) => {
    res.redirect("https://forms.monday.com/forms/d94222cdbf7f7ad9647ba19a9be84e53?r=use1");
  });
  
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
