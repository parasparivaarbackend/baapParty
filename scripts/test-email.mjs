// Quick SMTP check — run BEFORE turning on OTP:
//   npm run test:email -- you@example.com
// Reads SMTP_* and EMAIL_FROM from .env.local (needs Node 20.6+).
import nodemailer from 'nodemailer';

const to = process.argv[2];
if (!to) {
  console.error('Usage: npm run test:email -- you@example.com');
  process.exit(1);
}

const { SMTP_HOST, SMTP_PORT = '587', SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;
if (!SMTP_HOST) {
  console.error('✗ SMTP_HOST is not set. Fill the SMTP_* values in .env.local first.');
  process.exit(1);
}

const port = Number(SMTP_PORT);
const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure: port === 465,
  auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

try {
  console.log(`Connecting to ${SMTP_HOST}:${port} …`);
  await transport.verify();
  console.log('✓ Connected and logged in');
  const info = await transport.sendMail({
    from: EMAIL_FROM || SMTP_USER,
    to,
    subject: 'SMTP test — election website',
    text: 'If you can read this, email sending works. You can now set OTP_ENABLED=true.',
  });
  console.log('✓ Sent. Accepted:', info.accepted.join(', ') || '(none)', '| Rejected:', info.rejected.join(', ') || '(none)');
  console.log('Now check the inbox AND the spam folder.');
} catch (err) {
  console.error(`✗ Failed${err.code ? ` (${err.code})` : ''}: ${err.message}`);
  if (err.code === 'EAUTH') console.error('  → Wrong login. Gmail needs an App Password; Brevo needs its SMTP key; SES needs SMTP credentials (not your AWS keys).');
  else if (['ETIMEDOUT', 'ECONNECTION', 'ESOCKET', 'ECONNREFUSED', 'EDNS'].includes(err.code)) console.error('  → Cannot reach the server. Check SMTP_HOST, use port 587 (or 465); many hosts block port 25.');
  else if (err.responseCode === 553 || err.responseCode === 550) console.error('  → The sender address (EMAIL_FROM) is not allowed. Use an address on a domain/mailbox verified with your provider.');
  process.exit(1);
}
