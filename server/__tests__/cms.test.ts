import { describe, it, expect } from "vitest";
import {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getAllContactSubmissions,
  getContactSubmissionById,
  createContactSubmission,
  markContactAsRead,
  deleteContactSubmission,
} from "../db";

describe("CMS Database Operations", () => {
  let testBlogPostId: number;
  let testContactId: number;

  describe("Blog Posts", () => {
    it("should create a blog post", async () => {
      const id = await createBlogPost({
        title: "Test Blog Post",
        slug: "test-blog-post-" + Date.now(),
        excerpt: "This is a test excerpt",
        content: "This is test content",
        category: "Test Category",
        author: "Test Author",
        published: false,
      });

      expect(id).toBeDefined();
      expect(id).toBeGreaterThan(0);
      testBlogPostId = id;
    });

    it("should retrieve the blog post", async () => {
      const post = await getBlogPostById(testBlogPostId);

      expect(post).toBeDefined();
      expect(post?.title).toBe("Test Blog Post");
      expect(post?.published).toBe(false);
    });

    it("should update the blog post", async () => {
      await updateBlogPost(testBlogPostId, {
        published: true,
        title: "Updated Test Post",
      });

      const updated = await getBlogPostById(testBlogPostId);

      expect(updated?.published).toBe(true);
      expect(updated?.title).toBe("Updated Test Post");
    });

    it("should list all blog posts", async () => {
      const posts = await getAllBlogPosts(false);
      expect(Array.isArray(posts)).toBe(true);
    });

    it("should delete the blog post", async () => {
      await deleteBlogPost(testBlogPostId);

      const deleted = await getBlogPostById(testBlogPostId);
      expect(deleted).toBeUndefined();
    });
  });

  describe("Contact Submissions", () => {
    it("should create a contact submission", async () => {
      const id = await createContactSubmission({
        name: "Test User",
        email: "test@example.com",
        phone: "01234567890",
        company: "Test Company",
        message: "This is a test message",
      });

      expect(id).toBeDefined();
      expect(id).toBeGreaterThan(0);
      testContactId = id;
    });

    it("should retrieve the contact submission", async () => {
      const contact = await getContactSubmissionById(testContactId);

      expect(contact).toBeDefined();
      expect(contact?.name).toBe("Test User");
      expect(contact?.email).toBe("test@example.com");
      expect(contact?.read).toBe(false);
    });

    it("should mark contact as read", async () => {
      await markContactAsRead(testContactId);

      const updated = await getContactSubmissionById(testContactId);
      expect(updated?.read).toBe(true);
    });

    it("should list all contact submissions", async () => {
      const contacts = await getAllContactSubmissions();
      expect(Array.isArray(contacts)).toBe(true);
    });

    it("should delete the contact submission", async () => {
      await deleteContactSubmission(testContactId);

      const deleted = await getContactSubmissionById(testContactId);
      expect(deleted).toBeUndefined();
    });
  });
});
