import { Resend } from "resend";

/**
 * SUPPORT TICKET EMAIL SERVICE
 * Fresh implementation with proper error handling and logging
 */

// Configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SENDER_EMAIL = "Umbrella Broadband <support@umbrella-broadband.co.uk>";
const SUPPORT_EMAIL = "support@umbrella-broadband.co.uk";
const CC_RECIPIENTS = ["gavin@umbrella-broadband.co.uk", "Tyler@umbrella-broadband.co.uk"];

// Validate configuration
if (!RESEND_API_KEY) {
  console.error("[SUPPORT EMAIL] ERROR: RESEND_API_KEY not configured!");
}

if (!RESEND_API_KEY?.startsWith("re_")) {
  console.error("[SUPPORT EMAIL] ERROR: RESEND_API_KEY has invalid format!");
}

/**
 * Send support ticket to support team
 */
export async function sendSupportTicketToTeam(data: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  macAddress?: string;
  issueType: string;
  urgency: "low" | "medium" | "high" | "critical";
  description: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    console.log("[SUPPORT EMAIL] Sending support ticket to team...");
    console.log("[SUPPORT EMAIL] API Key:", RESEND_API_KEY?.substring(0, 10) + "...");
    console.log("[SUPPORT EMAIL] Sender:", SENDER_EMAIL);
    console.log("[SUPPORT EMAIL] To:", SUPPORT_EMAIL);
    console.log("[SUPPORT EMAIL] CC:", CC_RECIPIENTS);

    const resend = new Resend(RESEND_API_KEY);

    const urgencyEmoji = {
      low: "🟢",
      medium: "🟡",
      high: "🟠",
      critical: "🔴",
    }[data.urgency];

    const subject = `${urgencyEmoji} Support Ticket: ${data.issueType} - ${data.name}`;

    const text = `
NEW SUPPORT TICKET
==================

URGENCY: ${data.urgency.toUpperCase()} ${urgencyEmoji}
ISSUE TYPE: ${data.issueType}

CUSTOMER DETAILS
================
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Address: ${data.address || "Not provided"}
MAC Address: ${data.macAddress || "Not provided"}

ISSUE DESCRIPTION
=================
${data.description}

---
This support ticket was submitted via the Umbrella Broadband website.
Submitted at: ${new Date().toISOString()}
    `.trim();

    const { data: emailData, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: SUPPORT_EMAIL,
      cc: CC_RECIPIENTS,
      subject,
      text,
    });

    if (error) {
      console.error("[SUPPORT EMAIL] ERROR sending to team:", error);
      return { success: false, error: error.message };
    }

    console.log("[SUPPORT EMAIL] SUCCESS: Ticket sent to team. Message ID:", emailData?.id);
    return { success: true, messageId: emailData?.id };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("[SUPPORT EMAIL] EXCEPTION:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Send confirmation email to customer
 */
export async function sendSupportConfirmationToCustomer(data: {
  name: string;
  email: string;
  issueType: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    console.log("[SUPPORT EMAIL] Sending confirmation to customer...");
    console.log("[SUPPORT EMAIL] To:", data.email);

    const resend = new Resend(RESEND_API_KEY);

    const subject = "Support Ticket Received - Umbrella Broadband";

    const text = `
Dear ${data.name},

Thank you for contacting Umbrella Broadband Support. We have received your support request regarding "${data.issueType}" and our technical team is reviewing it.

We aim to respond to all support requests within 24 hours during business hours. For urgent issues, please call our support line on 01926 298866.

Best regards,
The Umbrella Broadband Support Team

---
Umbrella Broadband Support
Phone: 01926 298866
Email: support@umbrella-broadband.co.uk
Website: www.umbrella-broadband.co.uk
    `.trim();

    const { data: emailData, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: data.email,
      subject,
      text,
    });

    if (error) {
      console.error("[SUPPORT EMAIL] ERROR sending confirmation:", error);
      return { success: false, error: error.message };
    }

    console.log("[SUPPORT EMAIL] SUCCESS: Confirmation sent to customer. Message ID:", emailData?.id);
    return { success: true, messageId: emailData?.id };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("[SUPPORT EMAIL] EXCEPTION:", errorMsg);
    return { success: false, error: errorMsg };
  }
}
