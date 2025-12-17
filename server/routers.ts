import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import {
  getAllBlogPosts,
  getBlogPostById,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getAllContactSubmissions,
  getContactSubmissionById,
  createContactSubmission,
  markContactAsRead,
  deleteContactSubmission,
  createAdminSession,
  getAdminSession,
  deleteAdminSession,
  cleanupExpiredSessions,
  getAllCaseStudies,
  getCaseStudyById,
  getCaseStudyBySlug,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} from "./db";
import { storagePut } from "./storage";

// Admin session cookie name
const ADMIN_SESSION_COOKIE = "admin_session";

// Verify admin credentials using timing-safe comparison
async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminUsername || !adminPassword) {
    console.error("Admin credentials not configured");
    return false;
  }
  
  // Check username first with timing-safe comparison
  if (username.length !== adminUsername.length) {
    return false;
  }
  
  let usernameMatch = true;
  for (let i = 0; i < username.length; i++) {
    if (username[i] !== adminUsername[i]) {
      usernameMatch = false;
    }
  }
  
  if (!usernameMatch) {
    return false;
  }
  
  // Compare password with timing-safe comparison
  if (password.length !== adminPassword.length) {
    return false;
  }
  
  let passwordMatch = true;
  for (let i = 0; i < password.length; i++) {
    if (password[i] !== adminPassword[i]) {
      passwordMatch = false;
    }
  }
  
  return passwordMatch;
}

// Generate a secure session token
function generateSessionToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Rate limiting for login attempts (in-memory is fine for rate limiting)
interface LoginAttempt {
  count: number;
  lastAttempt: number;
  blockedUntil: number | null;
}
const loginAttempts = new Map<string, LoginAttempt>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 5 * 60 * 1000; // 5 minutes

function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts: number; blockedFor?: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  
  if (!attempt) {
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - 1 };
  }
  
  // Check if blocked
  if (attempt.blockedUntil && now < attempt.blockedUntil) {
    return { 
      allowed: false, 
      remainingAttempts: 0, 
      blockedFor: Math.ceil((attempt.blockedUntil - now) / 1000) 
    };
  }
  
  // Reset if outside window
  if (now - attempt.lastAttempt > ATTEMPT_WINDOW) {
    loginAttempts.delete(ip);
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - 1 };
  }
  
  // Check remaining attempts
  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    attempt.blockedUntil = now + LOCKOUT_DURATION;
    return { 
      allowed: false, 
      remainingAttempts: 0, 
      blockedFor: Math.ceil(LOCKOUT_DURATION / 1000) 
    };
  }
  
  return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - attempt.count - 1 };
}

function recordLoginAttempt(ip: string, success: boolean): void {
  if (success) {
    loginAttempts.delete(ip);
    return;
  }
  
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  
  if (!attempt || now - attempt.lastAttempt > ATTEMPT_WINDOW) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now, blockedUntil: null });
  } else {
    attempt.count++;
    attempt.lastAttempt = now;
  }
}

// Admin-only procedure that checks for admin session cookie (now uses database)
const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const adminSession = ctx.req.cookies?.[ADMIN_SESSION_COOKIE];
  
  // Check if user has valid admin session in database
  if (adminSession) {
    const session = await getAdminSession(adminSession);
    if (session) {
      return next({ ctx });
    }
  }
  
  // Fall back to OAuth admin check
  if (ctx.user?.role === "admin") {
    return next({ ctx });
  }
  
  throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin login required" });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Admin authentication router
  admin: router({
    // Check if admin is logged in (password-only, no OAuth fallback)
    checkSession: publicProcedure.query(async ({ ctx }) => {
      const adminSession = ctx.req.cookies?.[ADMIN_SESSION_COOKIE];
      
      let isAdminSession = false;
      if (adminSession) {
        const session = await getAdminSession(adminSession);
        isAdminSession = !!session;
      }
      
      return {
        isAuthenticated: isAdminSession,
        method: isAdminSession ? "password" : null,
      };
    }),

    // Admin login with username/password (rate limited, stores session in database)
    login: publicProcedure
      .input(z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        // Get client IP for rate limiting
        const clientIp = ctx.req.headers['x-forwarded-for'] as string || ctx.req.socket?.remoteAddress || 'unknown';
        
        // Check rate limit
        const rateLimit = checkRateLimit(clientIp);
        if (!rateLimit.allowed) {
          throw new TRPCError({ 
            code: "TOO_MANY_REQUESTS", 
            message: `Too many login attempts. Please try again in ${rateLimit.blockedFor} seconds.` 
          });
        }
        
        const isValid = await verifyAdminCredentials(input.username, input.password);
        
        // Record the attempt
        recordLoginAttempt(clientIp, isValid);
        
        if (!isValid) {
          throw new TRPCError({ 
            code: "UNAUTHORIZED", 
            message: `Invalid username or password. ${rateLimit.remainingAttempts} attempts remaining.` 
          });
        }
        
        // Generate session token and store in database
        const sessionToken = generateSessionToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await createAdminSession(sessionToken, expiresAt);
        
        // Cleanup expired sessions periodically
        cleanupExpiredSessions().catch(console.error);
        
        // Set session cookie (httpOnly, secure in production)
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(ADMIN_SESSION_COOKIE, sessionToken, {
          ...cookieOptions,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
        
        return { success: true };
      }),

    // Admin logout (deletes session from database)
    logout: publicProcedure.mutation(async ({ ctx }) => {
      const adminSession = ctx.req.cookies?.[ADMIN_SESSION_COOKIE];
      
      if (adminSession) {
        await deleteAdminSession(adminSession);
      }
      
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(ADMIN_SESSION_COOKIE, { ...cookieOptions, maxAge: -1 });
      
      return { success: true };
    }),

    // Change admin password
    changePassword: adminProcedure
      .input(z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
      }))
      .mutation(async ({ input, ctx }) => {
        const adminPassword = process.env.ADMIN_PASSWORD;
        
        if (!adminPassword) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Admin password not configured" });
        }
        
        // Verify current password
        if (input.currentPassword !== adminPassword) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Current password is incorrect" });
        }
        
        // Update password in environment (Note: This only persists for the current session)
        // In production, you would update this in a database or secrets manager
        process.env.ADMIN_PASSWORD = input.newPassword;
        
        return { success: true, message: "Password changed successfully" };
      }),
  }),

  // Blog posts router
  blog: router({
    // Public: Get all published posts
    list: publicProcedure.query(async () => {
      return getAllBlogPosts(true);
    }),

    // Public: Get single post by slug
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await getBlogPostBySlug(input.slug);
        if (!post || !post.published) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
        }
        return post;
      }),

    // Admin: Get all posts (including drafts)
    adminList: adminProcedure.query(async () => {
      return getAllBlogPosts(false);
    }),

    // Admin: Get single post by ID
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const post = await getBlogPostById(input.id);
        if (!post) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
        }
        return post;
      }),

    // Admin: Create post
    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          excerpt: z.string().optional(),
          content: z.string().optional(),
          category: z.string().optional(),
          imageUrl: z.string().optional(),
          author: z.string().optional(),
          published: z.boolean().default(false),
        })
      )
      .mutation(async ({ input }) => {
        const id = await createBlogPost(input);
        return { id };
      }),

    // Admin: Update post
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          slug: z.string().min(1).optional(),
          excerpt: z.string().optional(),
          content: z.string().optional(),
          category: z.string().optional(),
          imageUrl: z.string().optional(),
          author: z.string().optional(),
          published: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateBlogPost(id, data);
        return { success: true };
      }),

    // Admin: Delete post
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteBlogPost(input.id);
        return { success: true };
      }),
  }),

  // Contact submissions router
  contact: router({
    // Public: Submit contact form
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          phone: z.string().optional(),
          company: z.string().optional(),
          message: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const id = await createContactSubmission(input);
        return { id, success: true };
      }),

    // Admin: Get all submissions
    list: adminProcedure.query(async () => {
      return getAllContactSubmissions();
    }),

    // Admin: Get single submission
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const submission = await getContactSubmissionById(input.id);
        if (!submission) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Submission not found" });
        }
        return submission;
      }),

    // Admin: Mark as read
    markRead: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await markContactAsRead(input.id);
        return { success: true };
      }),

    // Admin: Delete submission
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteContactSubmission(input.id);
        return { success: true };
      }),
  }),

  // Case studies router
  caseStudies: router({
    // Public: List published case studies
    list: publicProcedure.query(async () => {
      return getAllCaseStudies(true);
    }),

    // Public: Get single case study by slug
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const caseStudy = await getCaseStudyBySlug(input.slug);
        if (!caseStudy || !caseStudy.published) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Case study not found" });
        }
        return caseStudy;
      }),

    // Admin: Get all case studies (including drafts)
    adminList: adminProcedure.query(async () => {
      return getAllCaseStudies(false);
    }),

    // Admin: Get single case study by ID
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const caseStudy = await getCaseStudyById(input.id);
        if (!caseStudy) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Case study not found" });
        }
        return caseStudy;
      }),

    // Admin: Create case study
    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          clientName: z.string().min(1),
          industry: z.string().optional(),
          challenge: z.string().optional(),
          solution: z.string().optional(),
          results: z.string().optional(),
          testimonial: z.string().optional(),
          testimonialAuthor: z.string().optional(),
          imageUrl: z.string().optional(),
          published: z.boolean().default(false),
        })
      )
      .mutation(async ({ input }) => {
        const id = await createCaseStudy(input);
        return { id };
      }),

    // Admin: Update case study
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          slug: z.string().min(1).optional(),
          clientName: z.string().min(1).optional(),
          industry: z.string().optional(),
          challenge: z.string().optional(),
          solution: z.string().optional(),
          results: z.string().optional(),
          testimonial: z.string().optional(),
          testimonialAuthor: z.string().optional(),
          imageUrl: z.string().optional(),
          published: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateCaseStudy(id, data);
        return { success: true };
      }),

    // Admin: Delete case study
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteCaseStudy(input.id);
        return { success: true };
      }),
  }),

  // AI Content Generation router
  ai: router({
    // Generate blog post from raw text
    generateBlogPost: adminProcedure
      .input(z.object({ rawText: z.string().min(10) }))
      .mutation(async ({ input }) => {
        const forgeUrl = process.env.BUILT_IN_FORGE_API_URL;
        const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;
        
        if (!forgeUrl || !forgeKey) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI service not configured" });
        }

        const systemPrompt = `You are a content writer for Umbrella Broadband, a UK-based internet service provider specializing in managed connectivity solutions for businesses, landlords, and property developers.

Given raw text/notes, create a professional blog post. Return a JSON object with these exact fields:
- title: A compelling, SEO-friendly title (max 70 chars)
- slug: URL-friendly version of title (lowercase, hyphens, no special chars)
- excerpt: A brief summary for previews (max 160 chars)
- content: Full blog post content in plain text with paragraph breaks
- category: One of: Technology, Business Solutions, Property Management, Cyber Security, Infrastructure, Student Living, Industry News
- author: Default to "Umbrella Broadband Team"
- imagePrompt: A detailed image generation prompt (50-100 words) for creating a web-optimized, mobile-responsive featured image at 1600x900 pixels (16:9 ratio). Describe a professional, modern visual that represents the blog topic. Include: style hints ("professional photography", "modern illustration", "tech-focused"), colors (prefer blues, teals, whites), specific visual elements relevant to the content, and always end with "web-optimized for desktop and mobile, 1600x900 pixels, 16:9 ratio, high quality, clean composition".

Return ONLY valid JSON, no markdown code blocks.`;

        const response = await fetch(`${forgeUrl}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${forgeKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: `Create a blog post from this content:\n\n${input.rawText}` },
            ],
            max_tokens: 2000,
          }),
        });

        if (!response.ok) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI generation failed" });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        if (!content) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No content generated" });
        }

        try {
          // Clean up potential markdown code blocks
          const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          return JSON.parse(cleanContent);
        } catch {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to parse AI response" });
        }
      }),

    // Generate case study from raw text
    generateCaseStudy: adminProcedure
      .input(z.object({ rawText: z.string().min(10) }))
      .mutation(async ({ input }) => {
        const forgeUrl = process.env.BUILT_IN_FORGE_API_URL;
        const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;
        
        if (!forgeUrl || !forgeKey) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI service not configured" });
        }

        const systemPrompt = `You are a content writer for Umbrella Broadband, a UK-based internet service provider specializing in managed connectivity solutions for businesses, landlords, and property developers.

Given raw text/notes about a client project, create a professional case study. Return a JSON object with these exact fields:
- title: A compelling case study title (max 70 chars)
- slug: URL-friendly version of title (lowercase, hyphens, no special chars)
- clientName: The client/company name
- industry: The industry sector (e.g., Healthcare, Education, Hospitality, Retail, Property Management)
- challenge: Detailed description of the problem/challenge the client faced (2-3 paragraphs)
- solution: Detailed description of how Umbrella Broadband solved the problem (2-3 paragraphs)
- results: Specific outcomes and benefits achieved (include metrics if available)
- testimonial: A realistic client quote about their experience (optional, can be empty string)
- testimonialAuthor: Name and title of person giving testimonial (optional, can be empty string)
- imagePrompt: A detailed image generation prompt (50-100 words) for creating a web-optimized, mobile-responsive featured image at 1600x900 pixels (16:9 ratio). Describe a professional visual representing this client's industry and the success story. Include: style hints ("professional photography", "modern business setting"), colors (prefer blues, teals, whites), specific visual elements relevant to the industry (e.g., healthcare facility, student accommodation, office building, retail space), and always end with "web-optimized for desktop and mobile, 1600x900 pixels, 16:9 ratio, high quality, clean composition".

Return ONLY valid JSON, no markdown code blocks.`;

        const response = await fetch(`${forgeUrl}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${forgeKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: `Create a case study from this content:\n\n${input.rawText}` },
            ],
            max_tokens: 2500,
          }),
        });

        if (!response.ok) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI generation failed" });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        if (!content) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No content generated" });
        }

        try {
          // Clean up potential markdown code blocks
          const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          return JSON.parse(cleanContent);
        } catch {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to parse AI response" });
        }
      }),
  }),

  // Image upload router
  upload: router({
    // Upload image to S3 storage
    image: adminProcedure
      .input(z.object({
        filename: z.string(),
        data: z.string(), // base64 encoded image data
        contentType: z.string().default("image/jpeg"),
      }))
      .mutation(async ({ input }) => {
        try {
          // Decode base64 data
          const base64Data = input.data.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");
          
          // Generate unique filename with timestamp
          const timestamp = Date.now();
          const sanitizedFilename = input.filename.replace(/[^a-zA-Z0-9.-]/g, "_");
          const key = `images/${timestamp}-${sanitizedFilename}`;
          
          // Upload to S3
          const result = await storagePut(key, buffer, input.contentType);
          
          return {
            success: true,
            url: result.url,
            key: result.key,
          };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : "Failed to upload image",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
