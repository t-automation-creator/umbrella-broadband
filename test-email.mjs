import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : 'NOT SET');

if (!apiKey) {
  console.error('RESEND_API_KEY is not set!');
  process.exit(1);
}

const resend = new Resend(apiKey);

console.log('Sending test email...');

const { data, error } = await resend.emails.send({
  from: 'Umbrella Broadband <support@umbrella-broadband.co.uk>',
  to: 'taylor.deakyne@gmail.com',
  cc: ['gavin@umbrella-broadband.co.uk', 'Tyler@umbrella-broadband.co.uk'],
  subject: 'Direct Test Email - ' + new Date().toISOString(),
  text: 'This is a direct test email to verify the Resend configuration.',
  html: '<p>This is a direct test email to verify the Resend configuration.</p>',
});

if (error) {
  console.error('Error:', error);
} else {
  console.log('Success! Email ID:', data?.id);
}
