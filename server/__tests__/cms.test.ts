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
  getAllCaseStudies,
  getCaseStudyById,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} from "../db";

describe("CMS Database Operations", () => {
  let testBlogPostId: number;
  let testContactId: number;
  let testCaseStudyId: number;

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

  describe("Case Studies", () => {
    it("should create a case study", async () => {
      const id = await createCaseStudy({
        title: "Test Case Study",
        slug: "test-case-study-" + Date.now(),
        clientName: "Test Client",
        industry: "Technology",
        challenge: "Test challenge description",
        solution: "Test solution description",
        results: "Test results description",
        published: false,
      });

      expect(id).toBeDefined();
      expect(id).toBeGreaterThan(0);
      testCaseStudyId = id;
    });

    it("should retrieve the case study", async () => {
      const caseStudy = await getCaseStudyById(testCaseStudyId);

      expect(caseStudy).toBeDefined();
      expect(caseStudy?.title).toBe("Test Case Study");
      expect(caseStudy?.clientName).toBe("Test Client");
      expect(caseStudy?.published).toBe(false);
    });

    it("should update the case study", async () => {
      await updateCaseStudy(testCaseStudyId, {
        published: true,
        title: "Updated Test Case Study",
      });

      const updated = await getCaseStudyById(testCaseStudyId);

      expect(updated?.published).toBe(true);
      expect(updated?.title).toBe("Updated Test Case Study");
    });

    it("should list all case studies", async () => {
      const caseStudies = await getAllCaseStudies(false);
      expect(Array.isArray(caseStudies)).toBe(true);
    });

    it("should delete the case study", async () => {
      await deleteCaseStudy(testCaseStudyId);

      const deleted = await getCaseStudyById(testCaseStudyId);
      expect(deleted).toBeUndefined();
    });
  });
});
