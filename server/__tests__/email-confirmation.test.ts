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

// Set up environment variables for testing
process.env.SMTP_SALES_HOST = "smtp.test.com";
process.env.SMTP_SALES_PORT = "587";
process.env.SMTP_SALES_USER = "sales@test.com";
process.env.SMTP_SALES_PASS = "testpass";
process.env.SMTP_SUPPORT_HOST = "smtp.test.com";
process.env.SMTP_SUPPORT_PORT = "587";
process.env.SMTP_SUPPORT_USER = "support@test.com";
process.env.SMTP_SUPPORT_PASS = "testpass";

import {
  sendSalesConfirmation,
  sendSupportConfirmation,
  sendSalesEnquiry,
  sendSupportTicket,
} from "../services/email";

describe("Email Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sendSalesConfirmation", () => {
    it("should send a sales confirmation email for quote request", async () => {
      const result = await sendSalesConfirmation({
        name: "John Doe",
        email: "john@example.com",
        enquiryType: "quote",
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("test-message-id");
    });

    it("should send a sales confirmation email for callback request", async () => {
      const result = await sendSalesConfirmation({
        name: "Jane Smith",
        email: "jane@example.com",
        enquiryType: "callback",
      });

      expect(result.success).toBe(true);
    });

    it("should send a sales confirmation email for general enquiry", async () => {
      const result = await sendSalesConfirmation({
        name: "Bob Wilson",
        email: "bob@example.com",
        enquiryType: "general",
      });

      expect(result.success).toBe(true);
    });

    it("should default to general enquiry type if not specified", async () => {
      const result = await sendSalesConfirmation({
        name: "Test User",
        email: "test@example.com",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("sendSupportConfirmation", () => {
    it("should send a support confirmation email with issue type", async () => {
      const result = await sendSupportConfirmation({
        name: "John Doe",
        email: "john@example.com",
        issueType: "No internet connection",
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("test-message-id");
    });

    it("should send a support confirmation email without issue type", async () => {
      const result = await sendSupportConfirmation({
        name: "Jane Smith",
        email: "jane@example.com",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("sendSalesEnquiry", () => {
    it("should send a sales enquiry email with all fields", async () => {
      const result = await sendSalesEnquiry({
        name: "John Doe",
        email: "john@example.com",
        phone: "07123456789",
        company: "Test Company",
        propertyType: "Commercial",
        serviceInterest: "Managed Broadband",
        message: "I need broadband for my office",
        enquiryType: "general",
      });

      expect(result.success).toBe(true);
    });

    it("should send a callback request email", async () => {
      const result = await sendSalesEnquiry({
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "07987654321",
        enquiryType: "callback",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("sendSupportTicket", () => {
    it("should send a support ticket email with all fields", async () => {
      const result = await sendSupportTicket({
        name: "John Doe",
        email: "john@example.com",
        phone: "07123456789",
        propertyAddress: "123 Test Street",
        issueType: "No internet connection",
        urgency: "high",
        description: "My internet has been down for 2 hours",
      });

      expect(result.success).toBe(true);
    });

    it("should send a support ticket with minimal fields", async () => {
      const result = await sendSupportTicket({
        name: "Jane Smith",
        email: "jane@example.com",
        description: "General support request",
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
          description: `Test ${urgency} urgency`,
        });
        expect(result.success).toBe(true);
      }
    });
  });
});
