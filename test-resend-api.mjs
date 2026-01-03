import { Resend } from 'resend';

async function testResendAPI() {
  console.log('=== RESEND API TEST ===\n');
  
  const apiKey = process.env.RESEND_API_KEY;
  
  // Test 1: Check API key
  console.log('TEST 1: API Key Configuration');
  console.log('API Key exists:', !!apiKey);
  if (apiKey) {
    console.log('API Key preview:', `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
    console.log('Starts with re_:', apiKey.startsWith('re_'));
  } else {
    console.error('ERROR: RESEND_API_KEY not set!');
    process.exit(1);
  }
  console.log();

  // Test 2: Initialize Resend client
  console.log('TEST 2: Initialize Resend Client');
  try {
    const resend = new Resend(apiKey);
    console.log('✓ Resend client initialized successfully');
  } catch (err) {
    console.error('✗ Failed to initialize Resend:', err.message);
    process.exit(1);
  }
  console.log();

  // Test 3: Send test email with support domain
  console.log('TEST 3: Send Test Email (Support Domain)');
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: 'Umbrella Broadband <support@umbrella-broadband.co.uk>',
    to: 'taylor.deakyne@gmail.com',
    subject: 'API Test - Support Domain',
    text: 'This is a test email from the support@umbrella-broadband.co.uk domain.',
    html: '<p>This is a test email from the <strong>support@umbrella-broadband.co.uk</strong> domain.</p>',
  });

  if (error) {
    console.error('✗ Error sending email:', error.message);
    console.error('Full error:', error);
  } else {
    console.log('✓ Email sent successfully');
    console.log('Message ID:', data?.id);
  }
  console.log();

  // Test 4: Send test email with CC
  console.log('TEST 4: Send Test Email (With CC)');
  const { data: data2, error: error2 } = await resend.emails.send({
    from: 'Umbrella Broadband <support@umbrella-broadband.co.uk>',
    to: 'support@umbrella-broadband.co.uk',
    cc: ['gavin@umbrella-broadband.co.uk', 'Tyler@umbrella-broadband.co.uk'],
    subject: 'API Test - With CC',
    text: 'This is a test email with CC recipients.',
    html: '<p>This is a test email with <strong>CC recipients</strong>.</p>',
  });

  if (error2) {
    console.error('✗ Error sending email with CC:', error2.message);
    console.error('Full error:', error2);
  } else {
    console.log('✓ Email with CC sent successfully');
    console.log('Message ID:', data2?.id);
  }
  console.log();

  console.log('=== ALL TESTS COMPLETE ===');
}

testResendAPI().catch(console.error);
