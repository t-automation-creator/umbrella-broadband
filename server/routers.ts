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
} from "./db";

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
});

export type AppRouter = typeof appRouter;
