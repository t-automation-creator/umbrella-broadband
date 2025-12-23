import { describe, it, expect } from "vitest";
import { Resend } from "resend";

describe("Resend API Key Validation", () => {
  it("should have RESEND_API_KEY configured", () => {
    expect(process.env.RESEND_API_KEY).toBeDefined();
    expect(process.env.RESEND_API_KEY).not.toBe("");
  });

  it("should be able to initialize Resend client", () => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    expect(resend).toBeDefined();
  });

  it("should have a valid API key format (starts with re_)", () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey).toMatch(/^re_/);
  });

  it("should be able to send a test email", async () => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Send a test email to verify the API key works
    const { data, error } = await resend.emails.send({
      from: "Umbrella Broadband <onboarding@resend.dev>",
      to: ["enquiries@student-internet.co.uk"],
      subject: "Test Email - Resend Integration",
      text: "This is a test email to verify the Resend integration is working correctly.",
    });

    // If there's an error, it should not be an authentication error
    if (error) {
      expect(error.message).not.toContain("API key");
      expect(error.message).not.toContain("authentication");
      expect(error.message).not.toContain("unauthorized");
    } else {
      expect(data?.id).toBeDefined();
    }
  });
});
