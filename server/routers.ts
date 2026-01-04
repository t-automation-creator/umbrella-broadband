import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { notifyOwner } from "./_core/notification";
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
  getAllChatLeads,
  getChatLeadById,
  createChatLead,
  updateChatLead,
  deleteChatLead,
} from "./db";
import { storagePut } from "./storage";
import sharp from "sharp";
import { sendSalesEnquiry, sendSalesConfirmation } from "./services/email";
import { sendSupportTicketToTeam, sendSupportConfirmationToCustomer } from "./services/support-email";
import { urlValidationRouter } from "./routers/url-validation";

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
  urlValidation: urlValidationRouter,
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
          sources: z.string().optional(),
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
          excerpt: z.string().nullable().optional(),
          content: z.string().nullable().optional(),
          sources: z.string().nullable().optional(),
          category: z.string().nullable().optional(),
          imageUrl: z.string().nullable().optional(),
          author: z.string().nullable().optional(),
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

        // Send email notification via SMTP
        try {
          await sendSalesEnquiry({
            name: input.name,
            email: input.email,
            phone: input.phone,
            company: input.company,
            message: input.message,
            enquiryType: "general",
          });
        } catch (emailError) {
          // Log but don't fail the submission if email fails
          console.error("Failed to send contact email:", emailError);
        }

        // Send customer confirmation email
        try {
          await sendSalesConfirmation({
            name: input.name,
            email: input.email,
            enquiryType: "general",
          });
        } catch (confirmError) {
          console.error("Failed to send contact confirmation email:", confirmError);
        }

        // Also send in-app notification
        try {
          const contactDetails = [
            `Name: ${input.name}`,
            `Email: ${input.email}`,
            input.phone ? `Phone: ${input.phone}` : null,
            input.company ? `Company: ${input.company}` : null,
          ].filter(Boolean).join("\n");

          await notifyOwner({
            title: `📬 New Contact Form: ${input.name}`,
            content: `A new contact form submission has been received.\n\n${contactDetails}\n\nMessage:\n${input.message}\n\nView all submissions in your admin dashboard.`,
          });
        } catch (notifyError) {
          // Log but don't fail the submission if notification fails
          console.error("Failed to send contact notification:", notifyError);
        }

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
          industry: z.string().nullable().optional(),
          challenge: z.string().nullable().optional(),
          solution: z.string().nullable().optional(),
          results: z.string().nullable().optional(),
          testimonial: z.string().nullable().optional(),
          testimonialAuthor: z.string().nullable().optional(),
          imageUrl: z.string().nullable().optional(),
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
- imagePrompt: A detailed image generation prompt (80-120 words) for creating a tech-infused, web-optimized featured image at 800x450 pixels (16:9 ratio). IMPORTANT: DO NOT include any text, titles, or typography in the image - headings will be overlaid as HTML. The image MUST include: 1) The Umbrella Broadband logo (a shield/umbrella icon in teal/blue) positioned subtly in a corner, 2) Tech elements relevant to the topic (fibre optic cables with light trails, network routers, ethernet connections, WiFi signals, server racks, or connectivity symbols), 3) Visual representation of the technology solution (no text labels), 4) Professional corporate aesthetic with blues, teals, and whites. Style: modern tech photography or sleek digital illustration with depth and lighting effects. Always end with "NO TEXT IN IMAGE, featuring Umbrella Broadband logo only, tech-infused, web-optimized for desktop and mobile, 800x450 pixels, 16:9 ratio, high quality, professional corporate aesthetic".

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
- imagePrompt: A detailed image generation prompt (80-120 words) for creating a tech-infused, web-optimized featured image at 800x450 pixels (16:9 ratio). IMPORTANT: DO NOT include any text, client names, or typography in the image - these will be overlaid as HTML. The image MUST include: 1) The Umbrella Broadband logo (a shield/umbrella icon in teal/blue) positioned subtly in a corner, 2) Tech elements showing the solution (fibre optic cables, network infrastructure, WiFi signals, routers, or connectivity symbols integrated into the scene), 3) The client's industry setting (e.g., student accommodation building, healthcare facility, office, retail space), 4) Professional corporate aesthetic with blues, teals, and whites. Style: modern tech-corporate photography. Always end with "NO TEXT IN IMAGE, featuring Umbrella Broadband logo only, tech-infused, web-optimized for desktop and mobile, 800x450 pixels, 16:9 ratio, high quality, professional corporate aesthetic".

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

    // Generate testimonial from case study content
    generateTestimonial: adminProcedure
      .input(z.object({
        clientName: z.string(),
        industry: z.string(),
        challenge: z.string(),
        solution: z.string(),
        results: z.string(),
      }))
      .mutation(async ({ input }) => {
        const forgeUrl = process.env.BUILT_IN_FORGE_API_URL;
        const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;
        
        if (!forgeUrl || !forgeKey) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI service not configured" });
        }

        const systemPrompt = `You are creating a realistic client testimonial for Umbrella Broadband, a UK-based internet service provider.

Given the case study details, generate a believable testimonial quote and author. The testimonial should:
- Sound natural and authentic (not overly promotional)
- Reference specific benefits or outcomes mentioned in the results
- Be 2-4 sentences long
- Use British English spelling

Return a JSON object with exactly these fields:
- testimonial: The quote (without quotation marks)
- testimonialAuthor: Name and job title, e.g., "Sarah Mitchell, IT Director"

Return ONLY valid JSON, no markdown code blocks.`;

        const userContent = `Client: ${input.clientName}
Industry: ${input.industry}
Challenge: ${input.challenge}
Solution: ${input.solution}
Results: ${input.results}`;

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
              { role: "user", content: userContent },
            ],
            max_tokens: 500,
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
          const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          return JSON.parse(cleanContent);
        } catch {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to parse AI response" });
        }
      }),
  }),

  // Image upload router
  upload: router({
    // Upload image to S3 storage with WebP conversion
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
          
          // Convert to WebP format using sharp with high quality for text readability
          const webpBuffer = await sharp(buffer)
            .webp({ quality: 95, nearLossless: true }) // High quality for text-heavy images
            .toBuffer();
          
          // Generate unique filename with timestamp (always .webp)
          const timestamp = Date.now();
          const baseName = input.filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9.-]/g, "_");
          const key = `images/${timestamp}-${baseName}.webp`;
          
          // Upload WebP to S3
          const result = await storagePut(key, webpBuffer, "image/webp");
          
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

  // Chat router for AI chatbot with lead capture
  chat: router({
    // Send a message to the AI chatbot
    sendMessage: publicProcedure
      .input(z.object({
        message: z.string().min(1),
        conversationHistory: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const forgeUrl = process.env.BUILT_IN_FORGE_API_URL;
        const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;

        if (!forgeUrl || !forgeKey) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Chat service not configured" });
        }

        const systemPrompt = `You are a helpful customer service assistant for Umbrella Broadband, a UK-based company providing managed connectivity solutions. Your role is to:

1. Answer questions about our services:
   - **Managed Broadband**: Full fibre and leased line solutions for businesses, landlords, and property developers. We handle installation, monitoring, and 24/7 support.
   - **VoIP Phone Systems**: Cloud-based business phone systems with features like call routing, voicemail-to-email, and mobile integration.
   - **CCTV & Security**: IP camera systems with remote monitoring, motion detection, and cloud storage.
   - **Management Services**: Ongoing network monitoring, maintenance, and technical support.

2. Understand our target markets:
   - Landlords & HMOs: Managed WiFi for rental properties
   - Student Accommodation: High-speed internet for student housing
   - SME Businesses: Reliable connectivity for small/medium businesses
   - Property Developers: Infrastructure installation for new builds

3. Identify buying intent signals (for NEW customers):
   - Questions about pricing, quotes, or costs
   - Specific property or business requirements
   - Timeline questions ("when can you install?")
   - Comparison questions ("how do you compare to...")
   - Location-specific questions

4. Identify SUPPORT issues (for EXISTING customers):
   - Internet not working, connection issues, outages
   - Slow speeds, buffering, latency problems
   - WiFi not connecting, signal issues
   - VoIP/phone problems, call quality issues
   - CCTV not recording, cameras offline
   - Router/equipment issues
   - Billing queries, account questions
   - Password resets, login issues
   - Any mention of "my internet", "my connection", "not working", "broken", "down"

When you detect buying intent (NEW customer), include "[LEAD_CAPTURE]" at the START of your response, then provide a helpful response and naturally suggest collecting their details.

When you detect a SUPPORT issue (EXISTING customer), include "[SUPPORT_TICKET]" at the START of your response, then empathise with their issue and explain that our technical team will help them. Suggest they fill in the support form so we can assist them quickly.

Be friendly, professional, and use British English. Keep responses concise but helpful. If you don't know something specific (like exact pricing), explain that a team member can provide a personalised quote.

For support issues, reassure the customer that our technical team is here to help and will respond as quickly as possible.

Contact info: Phone: 01926 298866, Email: enquiries@umbrella-broadband.co.uk (sales) or support@umbrella-broadband.co.uk (support), Based in Warwickshire, UK.`;

        // Build conversation messages
        const messages = [
          { role: "system", content: systemPrompt },
          ...(input.conversationHistory || []).map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: "user", content: input.message },
        ];

        try {
          const response = await fetch(`${forgeUrl}/v1/chat/completions`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${forgeKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages,
              max_tokens: 500,
              temperature: 0.7,
            }),
          });

          if (!response.ok) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Chat service unavailable" });
          }

          const data = await response.json();
          const content = data.choices?.[0]?.message?.content || "I apologise, I'm having trouble responding right now. Please call us on 01926 298866 or email enquiries@umbrella-broadband.co.uk.";

          // Check if AI detected buying intent or support issue
          const showLeadCapture = content.startsWith("[LEAD_CAPTURE]");
          const showSupportForm = content.startsWith("[SUPPORT_TICKET]");
          const cleanContent = content.replace("[LEAD_CAPTURE]", "").replace("[SUPPORT_TICKET]", "").trim();

          return {
            message: cleanContent,
            showLeadCapture,
            showSupportForm,
          };
        } catch (error) {
          console.error("Chat error:", error);
          return {
            message: "I apologise, I'm having trouble responding right now. Please call us on 01926 298866 or email enquiries@umbrella-broadband.co.uk.",
            showLeadCapture: false,
            showSupportForm: false,
          };
        }
      }),

    // Submit lead capture form
    submitLead: publicProcedure
      .input(z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        serviceInterest: z.string().optional(),
        propertyType: z.string().optional(),
        conversationSummary: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Require at least email or phone
        if (!input.email && !input.phone) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Please provide an email or phone number" });
        }

        const leadId = await createChatLead({
          name: input.name || null,
          email: input.email || null,
          phone: input.phone || null,
          company: input.company || null,
          serviceInterest: input.serviceInterest || null,
          propertyType: input.propertyType || null,
          conversationSummary: input.conversationSummary || null,
          status: "new",
        });

        // Send email notification via SMTP
        try {
          await sendSalesEnquiry({
            name: input.name || "Unknown",
            email: input.email || "Not provided",
            phone: input.phone,
            company: input.company,
            propertyType: input.propertyType,
            serviceInterest: input.serviceInterest,
            conversationSummary: input.conversationSummary,
            enquiryType: "quote",
          });
        } catch (emailError) {
          // Log but don't fail the lead creation if email fails
          console.error("Failed to send sales email:", emailError);
        }

        // Send customer confirmation email
        if (input.email) {
          try {
            await sendSalesConfirmation({
              name: input.name || "Customer",
              email: input.email,
              enquiryType: "quote",
            });
          } catch (confirmError) {
            console.error("Failed to send confirmation email:", confirmError);
          }
        }

        // Also send in-app notification
        try {
          const leadDetails = [
            input.name ? `Name: ${input.name}` : null,
            input.email ? `Email: ${input.email}` : null,
            input.phone ? `Phone: ${input.phone}` : null,
            input.company ? `Company: ${input.company}` : null,
            input.serviceInterest ? `Service Interest: ${input.serviceInterest}` : null,
            input.propertyType ? `Property Type: ${input.propertyType}` : null,
          ].filter(Boolean).join("\n");

          const conversationInfo = input.conversationSummary 
            ? `\n\nConversation Summary:\n${input.conversationSummary}` 
            : "";

          await notifyOwner({
            title: `🔔 New Chat Lead: ${input.name || input.email || input.phone || "Unknown"}`,
            content: `A new lead has been captured from the website chatbot.\n\n${leadDetails}${conversationInfo}\n\nView all leads in your admin dashboard.`,
          });
        } catch (notifyError) {
          // Log but don't fail the lead creation if notification fails
          console.error("Failed to send lead notification:", notifyError);
        }

        return { success: true, leadId };
      }),

    // Admin: Get all chat leads
    getLeads: adminProcedure.query(async () => {
      return getAllChatLeads();
    }),

    // Admin: Get single chat lead
    getLead: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getChatLeadById(input.id);
      }),

    // Admin: Update chat lead status/notes
    updateLead: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "qualified", "converted", "closed"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await updateChatLead(id, updates);
        return { success: true };
      }),

    // Admin: Delete chat lead
    deleteLead: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteChatLead(input.id);
        return { success: true };
      }),

    // DEBUG: Check API key
    debugApiKey: publicProcedure
      .query(() => {
        const apiKey = process.env.RESEND_API_KEY;
        return {
          apiKeyExists: !!apiKey,
          apiKeyPreview: apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : 'UNDEFINED',
          apiKeyStartsWithRe: apiKey?.startsWith('re_') ? 'YES' : 'NO',
          fullKey: apiKey, // For debugging only
        };
      }),

    // Submit support ticket (sends to support email)
    submitSupportTicket: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        company: z.string().optional(),
        propertyAddress: z.string().optional(),
        issueType: z.string().optional(),
        urgency: z.enum(["low", "medium", "high", "critical"]).optional(),
        description: z.string().min(1),
        conversationSummary: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Send support ticket via SMTP
        try {
          const result = await sendSupportTicketToTeam({
            name: input.name,
            email: input.email,
            phone: input.phone,
            address: input.propertyAddress,
            issueType: input.issueType || "General Issue",
            urgency: input.urgency || "medium",
            description: input.description,
          });

          if (!result.success) {
            console.error("Failed to send support ticket email:", result.error);
          }
        } catch (emailError) {
          console.error("Failed to send support ticket:", emailError);
        }

        // Send customer confirmation email
        try {
          await sendSupportConfirmationToCustomer({
            name: input.name,
            email: input.email,
            issueType: input.issueType || "General Issue",
          });
        } catch (confirmError) {
          console.error("Failed to send support confirmation email:", confirmError);
        }

        // Also send in-app notification
        try {
          const urgencyLabel = {
            low: "🟢 Low",
            medium: "🟡 Medium",
            high: "🟠 High",
            critical: "🔴 Critical",
          }[input.urgency || "medium"];

          await notifyOwner({
            title: `🎫 Support Ticket: ${input.issueType || "General Issue"} - ${input.name}`,
            content: `A new support ticket has been submitted.\n\nUrgency: ${urgencyLabel}\nName: ${input.name}\nEmail: ${input.email}${input.phone ? `\nPhone: ${input.phone}` : ""}${input.propertyAddress ? `\nProperty: ${input.propertyAddress}` : ""}\n\nIssue:\n${input.description}`,
          });
        } catch (notifyError) {
          console.error("Failed to send support notification:", notifyError);
        }

        return { success: true };
      }),

    // Submit callback request (sends to sales email)
    submitCallback: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        phone: z.string().min(1),
        email: z.string().email().optional(),
        company: z.string().optional(),
        propertyType: z.string().optional(),
        preferredTime: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Send callback request via SMTP
        try {
          await sendSalesEnquiry({
            name: input.name,
            email: input.email || "Not provided",
            phone: input.phone,
            company: input.company,
            propertyType: input.propertyType,
            message: input.preferredTime 
              ? `Callback requested. Preferred time: ${input.preferredTime}${input.notes ? `\n\nNotes: ${input.notes}` : ""}`
              : `Callback requested.${input.notes ? `\n\nNotes: ${input.notes}` : ""}`,
            enquiryType: "callback",
          });
        } catch (emailError) {
          console.error("Failed to send callback email:", emailError);
        }

        // Send customer confirmation email
        if (input.email) {
          try {
            await sendSalesConfirmation({
              name: input.name,
              email: input.email,
              enquiryType: "callback",
            });
          } catch (confirmError) {
            console.error("Failed to send callback confirmation email:", confirmError);
          }
        }

        // Also send in-app notification
        try {
          await notifyOwner({
            title: `📞 Callback Request: ${input.name}`,
            content: `A callback has been requested.\n\nName: ${input.name}\nPhone: ${input.phone}${input.email ? `\nEmail: ${input.email}` : ""}${input.company ? `\nCompany: ${input.company}` : ""}${input.propertyType ? `\nProperty Type: ${input.propertyType}` : ""}${input.preferredTime ? `\nPreferred Time: ${input.preferredTime}` : ""}${input.notes ? `\n\nNotes: ${input.notes}` : ""}`,
          });
        } catch (notifyError) {
          console.error("Failed to send callback notification:", notifyError);
        }

        return { success: true };
      }),

    // AI: Format blog content with headings and paragraphs
    formatContent: adminProcedure
      .input(z.object({ content: z.string().min(10) }))
      .mutation(async ({ input }) => {
        const forgeUrl = process.env.BUILT_IN_FORGE_API_URL;
        const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;
        
        if (!forgeUrl || !forgeKey) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI service not configured" });
        }

        const systemPrompt = `You are a content formatter for a professional business blog. Your task is to take raw text and format it for optimal readability.

Rules:
1. Break the content into logical sections with H2 headings (<h2>) for main topics and H3 headings (<h3>) for subtopics
2. Split long paragraphs into shorter, digestible ones (3-4 sentences max per paragraph)
3. Use <p> tags for paragraphs
4. Use <ul> and <li> for lists when appropriate (e.g., features, benefits, steps)
5. Use <strong> for key terms or important phrases (sparingly, 1-2 per paragraph max)
6. Preserve any existing links (<a> tags) exactly as they are
7. Do NOT add any new content - only format the existing text
8. Do NOT add introductions or conclusions that weren't in the original
9. Return ONLY the formatted HTML, no explanations or markdown code blocks

Example output structure:
<h2>Main Topic</h2>
<p>First paragraph with <strong>key term</strong> highlighted.</p>
<p>Second paragraph continues the discussion.</p>
<h3>Subtopic</h3>
<ul>
<li>First point</li>
<li>Second point</li>
</ul>`;

        try {
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
                { role: "user", content: `Format this content for optimal readability:\n\n${input.content}` },
              ],
              max_tokens: 4000,
              temperature: 0.3,
            }),
          });

          if (!response.ok) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI formatting failed" });
          }

          const data = await response.json();
          let formattedContent = data.choices?.[0]?.message?.content;
          
          if (!formattedContent) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No formatted content returned" });
          }

          // Clean up any markdown code blocks if present
          formattedContent = formattedContent.replace(/```html\n?/g, "").replace(/```\n?/g, "").trim();

          return { formattedContent };
        } catch (error) {
          console.error("Format content error:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to format content" });
        }
      }),

    // AI: Generate excerpt from blog content
    generateExcerpt: adminProcedure
      .input(z.object({ 
        content: z.string().min(50),
        title: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        const forgeUrl = process.env.BUILT_IN_FORGE_API_URL;
        const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;
        
        if (!forgeUrl || !forgeKey) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI service not configured" });
        }

        const systemPrompt = `You are a professional copywriter for a UK business broadband company. Generate a compelling excerpt/summary for a blog post.

Rules:
1. The excerpt should be 1-2 sentences (max 160 characters)
2. It should capture the main value or key insight of the post
3. Make it engaging and encourage readers to click through
4. Use professional British English
5. Do NOT use quotes or special characters
6. Return ONLY the excerpt text, nothing else`;

        try {
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
                { role: "user", content: `Generate an excerpt for this blog post${input.title ? ` titled "${input.title}"` : ""}:\n\n${input.content.substring(0, 2000)}` },
              ],
              max_tokens: 200,
              temperature: 0.7,
            }),
          });

          if (!response.ok) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI generation failed" });
          }

          const data = await response.json();
          let excerpt = data.choices?.[0]?.message?.content?.trim();
          
          if (!excerpt) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No excerpt generated" });
          }

          // Clean up any quotes
          excerpt = excerpt.replace(/^["']|["']$/g, "").trim();

          return { excerpt };
        } catch (error) {
          console.error("Generate excerpt error:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to generate excerpt" });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
