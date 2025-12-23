import nodemailer from "nodemailer";

// Test SMTP configuration
const configs = {
  sales: {
    host: process.env.SMTP_SALES_HOST || "smtp.office365.com",
    port: parseInt(process.env.SMTP_SALES_PORT || "587"),
    user: process.env.SMTP_SALES_USER,
    pass: process.env.SMTP_SALES_PASS,
  },
  support: {
    host: process.env.SMTP_SUPPORT_HOST || "smtp.office365.com",
    port: parseInt(process.env.SMTP_SUPPORT_PORT || "587"),
    user: process.env.SMTP_SUPPORT_USER,
    pass: process.env.SMTP_SUPPORT_PASS,
  },
};

async function testConnection(name, config) {
  console.log(`\n=== Testing ${name} SMTP ===`);
  console.log(`Host: ${config.host}`);
  console.log(`Port: ${config.port}`);
  console.log(`User: ${config.user}`);
  console.log(`Pass: ${config.pass ? "***" + config.pass.slice(-4) : "NOT SET"}`);

  if (!config.user || !config.pass) {
    console.log(`❌ ${name} SMTP credentials not configured!`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: false, // Use TLS
      auth: {
        user: config.user,
        pass: config.pass,
      },
      debug: true,
      logger: true,
    });

    console.log("\nVerifying connection...");
    await transporter.verify();
    console.log(`✅ ${name} SMTP connection verified successfully!`);

    // Try sending a test email
    console.log("\nSending test email...");
    const info = await transporter.sendMail({
      from: config.user,
      to: config.user, // Send to self
      subject: `Test Email from Umbrella Broadband - ${name}`,
      text: `This is a test email to verify ${name} SMTP configuration is working correctly.\n\nTimestamp: ${new Date().toISOString()}`,
      html: `<h2>Test Email</h2><p>This is a test email to verify ${name} SMTP configuration is working correctly.</p><p>Timestamp: ${new Date().toISOString()}</p>`,
    });

    console.log(`✅ Test email sent successfully!`);
    console.log(`Message ID: ${info.messageId}`);
    console.log(`Response: ${info.response}`);
  } catch (error) {
    console.log(`❌ ${name} SMTP Error:`, error.message);
    if (error.code) console.log(`Error code: ${error.code}`);
    if (error.response) console.log(`Server response: ${error.response}`);
  }
}

async function main() {
  console.log("SMTP Configuration Test");
  console.log("========================");
  
  await testConnection("Sales", configs.sales);
  await testConnection("Support", configs.support);
}

main().catch(console.error);
