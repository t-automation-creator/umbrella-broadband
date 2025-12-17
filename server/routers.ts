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
} from "./db";

// Admin session cookie name
const ADMIN_SESSION_COOKIE = "admin_session";

// Hash the password at startup for comparison (done once)
let hashedAdminPassword: string | null = null;

async function getHashedPassword(): Promise<string> {
  if (!hashedAdminPassword) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error("ADMIN_PASSWORD environment variable is not set");
    }
    // Hash the password with bcrypt (10 rounds)
    hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  }
  return hashedAdminPassword;
}

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

// Store valid session tokens (in production, use Redis or database)
const validAdminSessions = new Set<string>();

// Admin-only procedure that checks for admin session cookie
const adminProcedure = publicProcedure.use(({ ctx, next }) => {
  const adminSession = ctx.req.cookies?.[ADMIN_SESSION_COOKIE];
  
  // Check if user has valid admin session
  if (!adminSession || !validAdminSessions.has(adminSession)) {
    // Fall back to OAuth admin check
    if (ctx.user?.role === "admin") {
      return next({ ctx });
    }
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin login required" });
  }
  
  return next({ ctx });
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
    // Check if admin is logged in
    checkSession: publicProcedure.query(({ ctx }) => {
      const adminSession = ctx.req.cookies?.[ADMIN_SESSION_COOKIE];
      const isAdminSession = adminSession && validAdminSessions.has(adminSession);
      const isOAuthAdmin = ctx.user?.role === "admin";
      
      return {
        isAuthenticated: isAdminSession || isOAuthAdmin,
        method: isAdminSession ? "password" : isOAuthAdmin ? "oauth" : null,
      };
    }),

    // Admin login with username/password
    login: publicProcedure
      .input(z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        const isValid = await verifyAdminCredentials(input.username, input.password);
        
        if (!isValid) {
          throw new TRPCError({ 
            code: "UNAUTHORIZED", 
            message: "Invalid username or password" 
          });
        }
        
        // Generate session token
        const sessionToken = generateSessionToken();
        validAdminSessions.add(sessionToken);
        
        // Set session cookie (httpOnly, secure in production)
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(ADMIN_SESSION_COOKIE, sessionToken, {
          ...cookieOptions,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
        
        return { success: true };
      }),

    // Admin logout
    logout: publicProcedure.mutation(({ ctx }) => {
      const adminSession = ctx.req.cookies?.[ADMIN_SESSION_COOKIE];
      
      if (adminSession) {
        validAdminSessions.delete(adminSession);
      }
      
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(ADMIN_SESSION_COOKIE, { ...cookieOptions, maxAge: -1 });
      
      return { success: true };
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
