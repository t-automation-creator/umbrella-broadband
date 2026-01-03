# Support Ticket Submission Flow Trace

## Request Path
```
POST https://umbrella-broadband.co.uk/api/trpc/chat.submitSupportTicket?batch=1
Content-Type: application/json

{
  "name": "...",
  "email": "...",
  "phone": "...",
  "propertyAddress": "...",
  "issueType": "...",
  "urgency": "...",
  "description": "...",
  "conversationSummary": "..."
}
```

## Server Processing Flow

### 1. Express Server Entry Point
**File**: `server/_core/index.ts` (lines 47-52)
```typescript
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
```
- Request is routed to TRPC middleware
- No other middleware intercepts this request
- No database triggers or webhooks

### 2. TRPC Router
**File**: `server/routers.ts` (lines 1053-1116)
**Procedure**: `chat.submitSupportTicket`

The mutation receives the input and processes it:

```typescript
.mutation(async ({ input }) => {
  // STEP 1: Send support ticket email
  try {
    const result = await sendSupportTicket({
      name: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company,
      propertyAddress: input.propertyAddress,
      issueType: input.issueType,
      urgency: input.urgency,
      description: input.description,
      conversationSummary: input.conversationSummary,
    });
    // ... error handling
  }

  // STEP 2: Send customer confirmation email
  try {
    await sendSupportConfirmation({
      name: input.name,
      email: input.email,
      issueType: input.issueType,
    });
    // ... error handling
  }

  // STEP 3: Send in-app notification
  try {
    await notifyOwner({
      title: `🎫 Support Ticket: ${input.issueType || "General Issue"} - ${input.name}`,
      content: `...`,
    });
    // ... error handling
  }

  return { success: true };
})
```

### 3. Email Function 1: sendSupportTicket()
**File**: `server/services/email.ts` (lines 158-247)

**Direct Resend API Call** (NOT using sendEmail helper):
```typescript
const resend = new Resend(process.env.RESEND_API_KEY);
const { data: emailData, error } = await resend.emails.send({
  from: "Umbrella Broadband <support@umbrella-broadband.co.uk>",
  to: "support@umbrella-broadband.co.uk",
  cc: ["gavin@umbrella-broadband.co.uk", "Tyler@umbrella-broadband.co.uk"],
  subject: `Support Ticket: ${data.issueType || "General Issue"} - ${data.name}`,
  text: textParts,
  html: htmlParts,
});
```

**Recipients**:
- TO: support@umbrella-broadband.co.uk
- CC: gavin@umbrella-broadband.co.uk, Tyler@umbrella-broadband.co.uk

### 4. Email Function 2: sendSupportConfirmation()
**File**: `server/services/email.ts` (lines 302-370)

**Direct Resend API Call** (NOT using sendEmail helper):
```typescript
const resend = new Resend(process.env.RESEND_API_KEY);
const { data: emailData, error } = await resend.emails.send({
  from: "Umbrella Broadband <support@umbrella-broadband.co.uk>",
  to: data.email,  // Customer's email address
  subject: "Support Ticket Received - Umbrella Broadband",
  text: text,
  html: html,
});
```

**Recipients**:
- TO: Customer's email (from form submission)

## Summary

✅ **No other functions are called**
✅ **No middleware intercepts the request**
✅ **No database triggers send emails**
✅ **Both functions use direct Resend API calls**
✅ **Both use the same API key: `process.env.RESEND_API_KEY`**
✅ **Both use the correct sender: `support@umbrella-broadband.co.uk`**

## Verified API Key Usage

Both functions create a fresh Resend client:
```typescript
const resend = new Resend(process.env.RESEND_API_KEY);
```

This ensures the current environment variable is used (not a cached value).

## Test Results

✅ Direct API test with new key works:
- TEST 3: Email to Gmail - SUCCESS (Message ID: f0fd6fe8...)
- TEST 4: Email with CC - SUCCESS (Message ID: aa807210...)

## Conclusion

The code flow is correct and uses the new API key. If emails are still coming from onboarding@resend.dev, the issue must be:

1. **Environment variable not updated** - The server process might not have reloaded the new API key
2. **Resend caching** - Resend might be caching the old API key association
3. **Old API key still active** - Need to verify the old key is truly deleted in Resend dashboard

**Next Steps**:
1. Restart the server to ensure new env var is loaded
2. Submit a new support ticket
3. Check if email now comes from support@umbrella-broadband.co.uk
