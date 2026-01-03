import { Resend } from "resend";

// Email types for routing
export type EmailType = "sales" | "support";

// Recipient email addresses
const EMAIL_RECIPIENTS = {
  sales: "taylor.deakyne@gmail.com",
  support: "support@umbrella-broadband.co.uk",
};

// CC recipients for support emails
const SUPPORT_CC_RECIPIENTS = [
  "gavin@umbrella-broadband.co.uk",
  "Tyler@umbrella-broadband.co.uk",
];

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Sender email - use Resend's default domain initially
const SENDER_EMAIL = "onboarding@resend.dev";
const SENDER_NAME = "Umbrella Broadband";

// Email payload interface
export interface EmailPayload {
  to?: string;
  subject: string;
  text: string;
  html?: string;
}

// Send email using Resend
export async function sendEmail(
  type: EmailType,
  payload: EmailPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn(`[Email] Resend API key not configured, skipping ${type} email`);
      return { success: false, error: "Resend API key not configured" };
    }

    const recipient = payload.to || EMAIL_RECIPIENTS[type];
    
    // Add CC recipients for support emails (only when sending to support inbox, not customer confirmations)
    const ccRecipients = type === "support" && !payload.to ? SUPPORT_CC_RECIPIENTS : undefined;
    
    const { data, error } = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: [recipient],
      cc: ccRecipients,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });

    if (error) {
      console.error(`[Email] Failed to send ${type} email:`, error.message);
      return { success: false, error: error.message };
    }

    console.log(`[Email] ${type} email sent successfully:`, data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Email] Failed to send ${type} email:`, errorMessage);
    return { success: false, error: errorMessage };
  }
}

// Send sales enquiry email
export async function sendSalesEnquiry(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  propertyType?: string;
  serviceInterest?: string;
  message?: string;
  conversationSummary?: string;
  enquiryType?: "general" | "callback" | "quote";
}): Promise<{ success: boolean; error?: string }> {
  const enquiryTypeLabel = {
    general: "General Enquiry",
    callback: "Callback Request",
    quote: "Quote Request",
  }[data.enquiryType || "general"];
  
  const subject = `New ${enquiryTypeLabel} from ${data.name}`;
  
  const textParts = [
    `New ${enquiryTypeLabel}`,
    "=".repeat(40),
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    data.company ? `Company: ${data.company}` : null,
    data.propertyType ? `Property Type: ${data.propertyType}` : null,
    data.serviceInterest ? `Service Interest: ${data.serviceInterest}` : null,
    "",
    data.message ? `Message:\n${data.message}` : null,
    data.conversationSummary ? `\nConversation Summary:\n${data.conversationSummary}` : null,
    "",
    "---",
    "This enquiry was submitted via the Umbrella Broadband website.",
  ].filter(Boolean).join("\n");
  
  const htmlParts = [
    `<h2>New ${enquiryTypeLabel}</h2>`,
    "<table style='border-collapse: collapse; width: 100%; max-width: 600px;'>",
    `<tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Name:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>${data.name}</td></tr>`,
    `<tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Email:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'><a href='mailto:${data.email}'>${data.email}</a></td></tr>`,
    data.phone ? `<tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Phone:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'><a href='tel:${data.phone}'>${data.phone}</a></td></tr>` : null,
    data.company ? `<tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Company:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>${data.company}</td></tr>` : null,
    data.propertyType ? `<tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Property Type:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>${data.propertyType}</td></tr>` : null,
    data.serviceInterest ? `<tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Service Interest:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>${data.serviceInterest}</td></tr>` : null,
    "</table>",
    data.message ? `<h3>Message:</h3><p style='white-space: pre-wrap;'>${data.message}</p>` : null,
    data.conversationSummary ? `<h3>Conversation Summary:</h3><p style='white-space: pre-wrap;'>${data.conversationSummary}</p>` : null,
    "<hr style='margin-top: 20px;'>",
    "<p style='color: #666; font-size: 12px;'>This enquiry was submitted via the Umbrella Broadband website.</p>",
  ].filter(Boolean).join("\n");
  
  return sendEmail("sales", { subject, text: textParts, html: htmlParts });
}

// Send support ticket email
export async function sendSupportTicket(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  propertyAddress?: string;
  issueType?: string;
  urgency?: "low" | "medium" | "high" | "critical";
  description: string;
  conversationSummary?: string;
}): Promise<{ success: boolean; error?: string }> {
  const urgencyLabel = {
    low: "🟢 Low",
    medium: "🟡 Medium",
    high: "🟠 High",
    critical: "🔴 Critical",
  }[data.urgency || "medium"];
  
  const subject = `Support Ticket: ${data.issueType || "General Issue"} - ${data.name}`;
  
  const textParts = [
    "New Support Ticket",
    "=".repeat(40),
    "",
    `Urgency: ${urgencyLabel}`,
    `Issue Type: ${data.issueType || "General"}`,
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    data.company ? `Company: ${data.company}` : null,
    data.propertyAddress ? `Property Address: ${data.propertyAddress}` : null,
    "",
    `Issue Description:\n${data.description}`,
    data.conversationSummary ? `\nConversation Summary:\n${data.conversationSummary}` : null,
    "",
    "---",
    "This support ticket was submitted via the Umbrella Broadband website.",
  ].filter(Boolean).join("\n");
  
  const urgencyColor = {
    low: "#22c55e",
    medium: "#eab308",
    high: "#f97316",
    critical: "#ef4444",
  }[data.urgency || "medium"];
  
  const htmlParts = [
    `<h2>New Support Ticket</h2>`,
    `<p style='display: inline-block; padding: 4px 12px; background: ${urgencyColor}; color: white; border-radius: 4px; font-weight: bold;'>${urgencyLabel}</p>`,
    `<p><strong>Issue Type:</strong> ${data.issueType || "General"}</p>`,
    "<table style='border-collapse: collapse; width: 100%; max-width: 600px; margin-top: 16px;'>",
    `<tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Name:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>${data.name}</td></tr>`,
    `<tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Email:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'><a href='mailto:${data.email}'>${data.email}</a></td></tr>`,
    data.phone ? `<tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Phone:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'><a href='tel:${data.phone}'>${data.phone}</a></td></tr>` : null,
    data.company ? `<tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Company:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>${data.company}</td></tr>` : null,
    data.propertyAddress ? `<tr><td style='padding: 8px; border-bottom: 1px solid #eee;'><strong>Property Address:</strong></td><td style='padding: 8px; border-bottom: 1px solid #eee;'>${data.propertyAddress}</td></tr>` : null,
    "</table>",
    `<h3>Issue Description:</h3><p style='white-space: pre-wrap; background: #f5f5f5; padding: 16px; border-radius: 8px;'>${data.description}</p>`,
    data.conversationSummary ? `<h3>Conversation Summary:</h3><p style='white-space: pre-wrap;'>${data.conversationSummary}</p>` : null,
    "<hr style='margin-top: 20px;'>",
    "<p style='color: #666; font-size: 12px;'>This support ticket was submitted via the Umbrella Broadband website.</p>",
  ].filter(Boolean).join("\n");
  
  return sendEmail("support", { subject, text: textParts, html: htmlParts });
}

// Send customer confirmation email for sales enquiry
export async function sendSalesConfirmation(data: {
  name: string;
  email: string;
  enquiryType?: "general" | "callback" | "quote";
}): Promise<{ success: boolean; error?: string }> {
  const enquiryTypeLabel = {
    general: "enquiry",
    callback: "callback request",
    quote: "quote request",
  }[data.enquiryType || "general"];
  
  const subject = `Thank you for your ${enquiryTypeLabel} - Umbrella Broadband`;
  
  const text = `Dear ${data.name},

Thank you for contacting Umbrella Broadband. We have received your ${enquiryTypeLabel} and one of our team members will be in touch with you shortly.

In the meantime, if you have any urgent questions, please don't hesitate to call us on 01926 298866.

Best regards,
The Umbrella Broadband Team

---
Umbrella Broadband
Managed Connectivity Solutions
Phone: 01926 298866
Email: enquiries@umbrella-broadband.co.uk
Website: www.umbrella-broadband.co.uk`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Umbrella Broadband</h1>
      </div>
      <div style="padding: 30px; background: #ffffff;">
        <p style="font-size: 16px; color: #333;">Dear ${data.name},</p>
        <p style="font-size: 16px; color: #333;">Thank you for contacting Umbrella Broadband. We have received your ${enquiryTypeLabel} and one of our team members will be in touch with you shortly.</p>
        <p style="font-size: 16px; color: #333;">In the meantime, if you have any urgent questions, please don't hesitate to call us on <a href="tel:01926298866" style="color: #0d9488;">01926 298866</a>.</p>
        <p style="font-size: 16px; color: #333;">Best regards,<br>The Umbrella Broadband Team</p>
      </div>
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">Umbrella Broadband | Managed Connectivity Solutions</p>
        <p style="margin: 5px 0;">Phone: 01926 298866 | Email: enquiries@umbrella-broadband.co.uk</p>
        <p style="margin: 5px 0;"><a href="https://www.umbrella-broadband.co.uk" style="color: #0d9488;">www.umbrella-broadband.co.uk</a></p>
      </div>
    </div>
  `;
  
  return sendEmail("sales", { to: data.email, subject, text, html });
}

// Send customer confirmation email for support ticket
export async function sendSupportConfirmation(data: {
  name: string;
  email: string;
  issueType?: string;
  ticketReference?: string;
}): Promise<{ success: boolean; error?: string }> {
  const subject = `Support Ticket Received - Umbrella Broadband`;
  
  const text = `Dear ${data.name},

Thank you for contacting Umbrella Broadband Support. We have received your support request regarding "${data.issueType || "your issue"}" and our technical team is reviewing it.

${data.ticketReference ? `Your ticket reference is: ${data.ticketReference}` : ""}

We aim to respond to all support requests within 24 hours during business hours. For urgent issues, please call our support line on 01926 298866.

Best regards,
The Umbrella Broadband Support Team

---
Umbrella Broadband Support
Phone: 01926 298866
Email: support@umbrella-broadband.co.uk
Website: www.umbrella-broadband.co.uk`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Umbrella Broadband Support</h1>
      </div>
      <div style="padding: 30px; background: #ffffff;">
        <p style="font-size: 16px; color: #333;">Dear ${data.name},</p>
        <p style="font-size: 16px; color: #333;">Thank you for contacting Umbrella Broadband Support. We have received your support request regarding "<strong>${data.issueType || "your issue"}</strong>" and our technical team is reviewing it.</p>
        ${data.ticketReference ? `<p style="font-size: 16px; color: #333; background: #f0f9ff; padding: 12px; border-radius: 8px;"><strong>Your ticket reference:</strong> ${data.ticketReference}</p>` : ""}
        <p style="font-size: 16px; color: #333;">We aim to respond to all support requests within 24 hours during business hours. For urgent issues, please call our support line on <a href="tel:01926298866" style="color: #0d9488;">01926 298866</a>.</p>
        <p style="font-size: 16px; color: #333;">Best regards,<br>The Umbrella Broadband Support Team</p>
      </div>
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">Umbrella Broadband Support</p>
        <p style="margin: 5px 0;">Phone: 01926 298866 | Email: support@umbrella-broadband.co.uk</p>
        <p style="margin: 5px 0;"><a href="https://www.umbrella-broadband.co.uk" style="color: #0d9488;">www.umbrella-broadband.co.uk</a></p>
      </div>
    </div>
  `;
  
  return sendEmail("support", { to: data.email, subject, text, html });
}
