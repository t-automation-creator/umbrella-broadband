#!/usr/bin/env node

import { Resend } from "resend";

const API_KEY = process.env.RESEND_API_KEY;
const SENDER = "Umbrella Broadband <support@umbrella-broadband.co.uk>";
const SUPPORT_EMAIL = "support@umbrella-broadband.co.uk";
const CC_RECIPIENTS = ["gavin@umbrella-broadband.co.uk", "Tyler@umbrella-broadband.co.uk"];
const TEST_EMAIL = "taylor.deakyne@gmail.com";

console.log("\n" + "=".repeat(70));
console.log("RESEND API COMPREHENSIVE TEST");
console.log("=".repeat(70));

// Test 1: Validate API Key
console.log("\n[TEST 1] Validating API Key...");
if (!API_KEY) {
  console.error("❌ FAILED: RESEND_API_KEY not configured");
  process.exit(1);
}
if (!API_KEY.startsWith("re_")) {
  console.error("❌ FAILED: API Key has invalid format (should start with 're_')");
  process.exit(1);
}
console.log("✅ PASSED: API Key is valid");
console.log(`   Key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)}`);

// Test 2: Initialize Resend client
console.log("\n[TEST 2] Initializing Resend client...");
let resend;
try {
  resend = new Resend(API_KEY);
  console.log("✅ PASSED: Resend client initialized");
} catch (err) {
  console.error("❌ FAILED: Could not initialize Resend client");
  console.error(err);
  process.exit(1);
}

// Test 3: Send support ticket to team
console.log("\n[TEST 3] Sending support ticket to team...");
console.log(`   From: ${SENDER}`);
console.log(`   To: ${SUPPORT_EMAIL}`);
console.log(`   CC: ${CC_RECIPIENTS.join(", ")}`);

try {
  const { data, error } = await resend.emails.send({
    from: SENDER,
    to: SUPPORT_EMAIL,
    cc: CC_RECIPIENTS,
    subject: "🟡 Support Ticket: Test Fault - John Doe",
    text: `NEW SUPPORT TICKET
==================

URGENCY: MEDIUM 🟡
ISSUE TYPE: Test Fault

CUSTOMER DETAILS
================
Name: John Doe
Email: john@example.com
Phone: 01926 298866
Address: 123 Test Street, London, UK
MAC Address: AA:BB:CC:DD:EE:FF

ISSUE DESCRIPTION
=================
This is a test support ticket to verify the Resend API is working correctly.

---
This support ticket was submitted via the Umbrella Broadband website.
Submitted at: ${new Date().toISOString()}`,
  });

  if (error) {
    console.error("❌ FAILED: Resend API error");
    console.error(error);
    process.exit(1);
  }

  console.log("✅ PASSED: Support ticket sent successfully");
  console.log(`   Message ID: ${data?.id}`);
} catch (err) {
  console.error("❌ FAILED: Exception sending support ticket");
  console.error(err);
  process.exit(1);
}

// Test 4: Send confirmation email to customer
console.log("\n[TEST 4] Sending confirmation email to customer...");
console.log(`   From: ${SENDER}`);
console.log(`   To: ${TEST_EMAIL}`);

try {
  const { data, error } = await resend.emails.send({
    from: SENDER,
    to: TEST_EMAIL,
    subject: "Support Ticket Received - Umbrella Broadband",
    text: `Dear John Doe,

Thank you for contacting Umbrella Broadband Support. We have received your support request regarding "Test Fault" and our technical team is reviewing it.

We aim to respond to all support requests within 24 hours during business hours. For urgent issues, please call our support line on 01926 298866.

Best regards,
The Umbrella Broadband Support Team

---
Umbrella Broadband Support
Phone: 01926 298866
Email: support@umbrella-broadband.co.uk
Website: www.umbrella-broadband.co.uk`,
  });

  if (error) {
    console.error("❌ FAILED: Resend API error");
    console.error(error);
    process.exit(1);
  }

  console.log("✅ PASSED: Confirmation email sent successfully");
  console.log(`   Message ID: ${data?.id}`);
} catch (err) {
  console.error("❌ FAILED: Exception sending confirmation email");
  console.error(err);
  process.exit(1);
}

// Test 5: Send to support@ with CC (matching form pattern)
console.log("\n[TEST 5] Sending with CC recipients (form pattern)...");
console.log(`   From: ${SENDER}`);
console.log(`   To: ${SUPPORT_EMAIL}`);
console.log(`   CC: ${CC_RECIPIENTS.join(", ")}`);

try {
  const { data, error } = await resend.emails.send({
    from: SENDER,
    to: SUPPORT_EMAIL,
    cc: CC_RECIPIENTS,
    subject: "Test Email with CC - Resend Integration",
    text: "This is a test email with CC recipients to verify the Resend API is working correctly.",
  });

  if (error) {
    console.error("❌ FAILED: Resend API error");
    console.error(error);
    process.exit(1);
  }

  console.log("✅ PASSED: Email with CC sent successfully");
  console.log(`   Message ID: ${data?.id}`);
} catch (err) {
  console.error("❌ FAILED: Exception sending email with CC");
  console.error(err);
  process.exit(1);
}

console.log("\n" + "=".repeat(70));
console.log("ALL TESTS PASSED ✅");
console.log("=".repeat(70));
console.log("\nThe Resend API is working correctly!");
console.log("You should receive test emails at:");
console.log(`  - ${SUPPORT_EMAIL}`);
console.log(`  - ${CC_RECIPIENTS[0]}`);
console.log(`  - ${CC_RECIPIENTS[1]}`);
console.log(`  - ${TEST_EMAIL}`);
console.log("\n");
