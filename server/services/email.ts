import nodemailer from "nodemailer";

// Email types for routing
export type EmailType = "sales" | "support";

// Email configuration from environment variables
const SMTP_CONFIG = {
  sales: {
    host: process.env.SMTP_SALES_HOST || "smtp.office365.com",
    port: parseInt(process.env.SMTP_SALES_PORT || "587"),
    user: process.env.SMTP_SALES_USER || "",
    pass: process.env.SMTP_SALES_PASS || "",
  },
  support: {
    host: process.env.SMTP_SUPPORT_HOST || "smtp.office365.com",
    port: parseInt(process.env.SMTP_SUPPORT_PORT || "587"),
    user: process.env.SMTP_SUPPORT_USER || "",
    pass: process.env.SMTP_SUPPORT_PASS || "",
  },
};

// Create transporter for a specific email type
function createTransporter(type: EmailType) {
  const config = SMTP_CONFIG[type];
  
  if (!config.user || !config.pass) {
    throw new Error(`SMTP credentials not configured for ${type} email`);
  }
  
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: false, // Use TLS
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

// Email payload interface
export interface EmailPayload {
  to?: string; // Optional - defaults to the SMTP user (self-send)
  subject: string;
  text: string;
  html?: string;
}

// Send email using the appropriate SMTP configuration
export async function sendEmail(
  type: EmailType,
  payload: EmailPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const config = SMTP_CONFIG[type];
    const transporter = createTransporter(type);
    
    const mailOptions = {
      from: config.user,
      to: payload.to || config.user, // Send to self if no recipient specified
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`[Email] ${type} email sent successfully:`, info.messageId);
    return { success: true, messageId: info.messageId };
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

// Test SMTP connection
export async function testSmtpConnection(type: EmailType): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter(type);
    await transporter.verify();
    console.log(`[Email] ${type} SMTP connection verified successfully`);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Email] ${type} SMTP connection failed:`, errorMessage);
    return { success: false, error: errorMessage };
  }
}
