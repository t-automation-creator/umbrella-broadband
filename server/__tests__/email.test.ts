import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock nodemailer before importing the email service
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-message-id" }),
      verify: vi.fn().mockResolvedValue(true),
    })),
  },
}));

// Import after mocking
import { sendEmail, sendSalesEnquiry, sendSupportTicket, testSmtpConnection } from "../services/email";

describe("Email Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up test environment variables
    process.env.SMTP_SALES_HOST = "smtp.office365.com";
    process.env.SMTP_SALES_PORT = "587";
    process.env.SMTP_SALES_USER = "test-sales@example.com";
    process.env.SMTP_SALES_PASS = "test-password";
    process.env.SMTP_SUPPORT_HOST = "smtp.office365.com";
    process.env.SMTP_SUPPORT_PORT = "587";
    process.env.SMTP_SUPPORT_USER = "test-support@example.com";
    process.env.SMTP_SUPPORT_PASS = "test-password";
  });

  describe("sendEmail", () => {
    it("should send a sales email successfully", async () => {
      const result = await sendEmail("sales", {
        subject: "Test Subject",
        text: "Test content",
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("test-message-id");
    });

    it("should send a support email successfully", async () => {
      const result = await sendEmail("support", {
        subject: "Test Subject",
        text: "Test content",
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("test-message-id");
    });
  });

  describe("sendSalesEnquiry", () => {
    it("should format and send a sales enquiry email", async () => {
      const result = await sendSalesEnquiry({
        name: "John Doe",
        email: "john@example.com",
        phone: "01234567890",
        company: "Test Company",
        propertyType: "HMO",
        serviceInterest: "broadband",
        message: "I need broadband for my property",
        enquiryType: "general",
      });

      expect(result.success).toBe(true);
    });

    it("should handle callback enquiry type", async () => {
      const result = await sendSalesEnquiry({
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "09876543210",
        enquiryType: "callback",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("sendSupportTicket", () => {
    it("should format and send a support ticket email", async () => {
      const result = await sendSupportTicket({
        name: "John Doe",
        email: "john@example.com",
        phone: "01234567890",
        propertyAddress: "123 Test Street",
        issueType: "No internet connection",
        urgency: "high",
        description: "My internet has been down since yesterday",
      });

      expect(result.success).toBe(true);
    });

    it("should handle different urgency levels", async () => {
      const urgencies = ["low", "medium", "high", "critical"] as const;
      
      for (const urgency of urgencies) {
        const result = await sendSupportTicket({
          name: "Test User",
          email: "test@example.com",
          urgency,
          description: `Testing ${urgency} urgency`,
        });

        expect(result.success).toBe(true);
      }
    });
  });

  describe("testSmtpConnection", () => {
    it("should verify sales SMTP connection", async () => {
      const result = await testSmtpConnection("sales");
      expect(result.success).toBe(true);
    });

    it("should verify support SMTP connection", async () => {
      const result = await testSmtpConnection("support");
      expect(result.success).toBe(true);
    });
  });
});
