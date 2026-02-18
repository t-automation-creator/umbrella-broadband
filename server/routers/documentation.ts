import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { documentationContent } from "../data/documentation";
import { TRPCError } from "@trpc/server";
import { getAdminSession } from "../db";

const ADMIN_SESSION_COOKIE = "admin_session";

// Admin-only procedure for documentation access
const adminDocProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const adminSession = ctx.req.cookies?.[ADMIN_SESSION_COOKIE];
  
  // Check if user has valid admin session in database
  if (adminSession) {
    const session = await getAdminSession(adminSession);
    if (session) {
      return next({ ctx });
    }
  }
  
  throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin login required" });
});

/**
 * Documentation module - searchable handover documentation
 * Auto-updates when site content changes
 */

// In-memory documentation store (cost-effective alternative to database)
const documentationStore = documentationContent;

export const documentationRouter = router({
  // Get all documentation
  getAll: adminDocProcedure.query(() => {
    return documentationStore;
  }),

  // Get single section by ID
  getSection: adminDocProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return documentationStore.find((doc) => doc.id === input.id);
    }),

  // Search documentation
  search: adminDocProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(({ input }) => {
      const query = input.query.toLowerCase();
      const results: any[] = [];

      documentationStore.forEach((section) => {
        // Search in title
        if (section.title.toLowerCase().includes(query)) {
          results.push({ ...section, matchType: "title" });
          return;
        }

        // Search in content
        if ('content' in section && section.content && (section.content as string).toLowerCase().includes(query)) {
          results.push({ ...section, matchType: "content" });
          return;
        }

        // Search in keywords
        if ('keywords' in section && section.keywords) {
          const keywordMatch = (section.keywords as string[]).some((k: string) => k.toLowerCase().includes(query));
          if (keywordMatch) {
            results.push({ ...section, matchType: "keyword" });
            return;
          }
        }

        // Search in items (for sections with items array)
        if ('items' in section && section.items && Array.isArray(section.items)) {
          const matchedItems: any[] = [];
          (section.items as any[]).forEach((item: any) => {
            const itemMatches = 
              (item.name && item.name.toLowerCase().includes(query)) ||
              (item.description && item.description.toLowerCase().includes(query)) ||
              (item.keywords && item.keywords.some((k: string) => k.toLowerCase().includes(query))) ||
              (item.url && item.url.toLowerCase().includes(query));

            if (itemMatches) {
              matchedItems.push(item);
            }
          });

          if (matchedItems.length > 0) {
            results.push({ ...section, items: matchedItems, matchType: "items" });
          }
        }
      });

      return results;
    }),

  // Update section (for real-time updates when site content changes)
  updateSection: adminDocProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      items: z.any().optional(),
      keywords: z.array(z.string()).optional(),
    }))
    .mutation(({ input }) => {
      const sectionIndex = documentationStore.findIndex((doc) => doc.id === input.id);
      if (sectionIndex === -1) {
        throw new Error("Section not found");
      }

      const section = documentationStore[sectionIndex];
      if (input.title) section.title = input.title;
      if (input.content) section.content = input.content;
      if (input.items) section.items = input.items;
      if (input.keywords) section.keywords = input.keywords;

      return section;
    }),
});
