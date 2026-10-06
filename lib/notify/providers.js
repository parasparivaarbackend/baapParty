// Low-level senders. Each returns { status: 'sent' | 'simulated' | 'skipped', detail? }
// or throws on a real failure. Configure through environment variables
// (see PHASE3_SETUP.md). With nothing configured, outside production they
// "simulate" by printing to the server console; in production they skip.
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { LOGO_PATH } from './emailTemplate';

const isProd = process.env.NODE_ENV === 'production';
const TIMEOUT_MS = 8000;

export const toIntl = (phone) => `91${String(phone).replace(/\D/g, '').slice(-10)}`;
export const maskPhone = (phone) => `******${String(phone).replace(/\D/g, '').slice(-4)}`;

async function post(url, { headers, body }) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body), signal: ctrl.signal });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
    return text;
  } finally {
    clearTimeout(timer);
  }
}

// ---- which channels are usable ------------------------------------------------
// Email is the only active channel today. SMS and WhatsApp are fully built but
// stay OFF until you set SMS_ENABLED=true / WHATSAPP_ENABLED=true.
export const smsEnabled = () => process.env.SMS_ENABLED === 'true';
export const whatsappEnabled = () => process.env.WHATSAPP_ENABLED === 'true';

export function channelAvailability() {
  const sms = smsEnabled() && (process.env.SMS_PROVIDER === 'msg91' ? !!process.env.MSG91_AUTH_KEY : !isProd);
  const whatsapp = whatsappEnabled() && (process.env.WHATSAPP_PROVIDER === 'meta'
    ? !!(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID)
    : !isProd);
  const email = process.env.SMTP_HOST ? true : !isProd;
  return { sms, whatsapp, email };
}

// ---- SMS (MSG91 Flow API; DLT-approved templates are required in India) ------
// `vars` map to the template's VAR1, VAR2… in order.
export async function sendSms(phone, templateEnv, vars) {
  if (process.env.SMS_PROVIDER === 'msg91') {
    const templateId = process.env[templateEnv];
    if (!process.env.MSG91_AUTH_KEY || !templateId) return { status: 'skipped', detail: `MSG91 not configured (${templateEnv})` };
    const recipient = { mobiles: toIntl(phone) };
    vars.forEach((v, i) => { recipient[`VAR${i + 1}`] = String(v); });
    const body = { template_id: templateId, short_url: '0', recipients: [recipient] };
    if (process.env.MSG91_SENDER_ID) body.sender = process.env.MSG91_SENDER_ID;
    await post('https://control.msg91.com/api/v5/flow/', { headers: { authkey: process.env.MSG91_AUTH_KEY }, body });
    return { status: 'sent' };
  }
  if (isProd) return { status: 'skipped', detail: 'SMS_PROVIDER is not configured' };
  console.log(`[SMS simulated] to ${maskPhone(phone)} via ${templateEnv}:`, vars);
  return { status: 'simulated' };
}

// ---- WhatsApp (Meta Cloud API, pre-approved template messages) ---------------
export async function sendWhatsApp(phone, templateEnv, vars) {
  if (process.env.WHATSAPP_PROVIDER === 'meta') {
    const name = process.env[templateEnv];
    if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID || !name) return { status: 'skipped', detail: `WhatsApp not configured (${templateEnv})` };
    const version = process.env.WHATSAPP_API_VERSION || 'v21.0';
    await post(`https://graph.facebook.com/${version}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
      body: {
        messaging_product: 'whatsapp',
        to: toIntl(phone),
        type: 'template',
        template: {
          name,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'en' },
          components: [{ type: 'body', parameters: vars.map((v) => ({ type: 'text', text: String(v) })) }],
        },
      },
    });
    return { status: 'sent' };
  }
  if (isProd) return { status: 'skipped', detail: 'WHATSAPP_PROVIDER is not configured' };
  console.log(`[WhatsApp simulated] to ${maskPhone(phone)} via ${templateEnv}:`, vars);
  return { status: 'simulated' };
}

// ---- Email (any SMTP server) --------------------------------------------------
// `html` is optional: when given, the message goes out as HTML with `text` as the plain-text
// fallback. Nothing is attached - the logo inside the HTML is loaded from the website.
let transport;

export async function sendEmail(to, subject, text, html) {
  if (process.env.SMTP_HOST) {
    transport ||= nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      connectionTimeout: TIMEOUT_MS,
      socketTimeout: TIMEOUT_MS,
    });
    await transport.sendMail({ from: process.env.EMAIL_FROM || process.env.SMTP_USER, to, subject, text, html });
    return { status: 'sent' };
  }
  if (isProd) return { status: 'skipped', detail: 'SMTP_HOST is not configured' };
  console.log(`[Email simulated] to ${to}: ${subject}\n${text}`);
  if (html) {
    // Dev convenience: save the HTML (logo embedded) so the design can be opened in a browser.
    try {
      const dir = path.join(process.cwd(), '.email-previews');
      fs.mkdirSync(dir, { recursive: true });
      const file = path.join(dir, `${Date.now()}.html`);
      const logo = fs.readFileSync(path.join(process.cwd(), 'public', LOGO_PATH)).toString('base64');
      const inline = html.replace(/src="[^"]*email-logo\.png"/, `src="data:image/png;base64,${logo}"`);
      fs.writeFileSync(file, inline);
      console.log(`[Email simulated] HTML preview saved: ${file}`);
    } catch {}
  }
  return { status: 'simulated' };
}
