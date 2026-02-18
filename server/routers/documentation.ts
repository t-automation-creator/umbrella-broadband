import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { documentationContent } from "../data/documentation";

/**
 * Documentation module - searchable handover documentation
 * Auto-updates when site content changes
 */

// In-memory documentation store (cost-effective alternative to database)
const documentationStore = documentationContent;

export const documentationRouter = router({
  // Get all documentation
  getAll: protectedProcedure.query(({ ctx }) => {
    // Only allow admins to view documentation
    if (ctx.user.role !== 'admin') {
      throw new Error('Only admins can access documentation');
    }
    return documentationStore;
  }),

  // Get single section by ID
  getSection: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Only admins can access documentation');
      }
      return documentationStore.find((doc) => doc.id === input.id);
    }),

  // Search documentation
  search: protectedProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Only admins can access documentation');
      }
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

  // Update section (for real-time updates when content changes)
  updateSection: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      items: z.any().optional(),
      keywords: z.array(z.string()).optional(),
    }))
    .mutation(({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Only admins can access documentation');
      }
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
