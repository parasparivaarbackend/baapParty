import crypto from 'crypto';
import { connectDB } from '@/lib/db/mongoose';
import OtpCode from '@/models/OtpCode';
import Grievance from '@/models/Grievance';
import { sendEmail } from '@/lib/notify/providers';
import { otpEmail } from '@/lib/notify/emailTemplate';
import { signTypedToken, verifyTypedToken } from '@/lib/auth';

const TTL_MS = 5 * 60 * 1000;
const RESEND_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;

/** OTP checks are opt-in: set OTP_ENABLED=true once email sending (SMTP) works. */
export const isOtpEnabled = () => process.env.OTP_ENABLED === 'true';

export const cleanEmail = (raw) => String(raw || '').trim().toLowerCase().slice(0, 120);
export const isValidEmail = (e) => /^\S+@\S+\.\S+$/.test(e);

const hash = (key, purpose, code) =>
  crypto.createHmac('sha256', process.env.JWT_SECRET || 'dev').update(`${key}:${purpose}:${code}`).digest('hex');

/** Creates and emails a 6-digit code. Returns { ok, wait?, devCode? }. */
export async function sendOtp(email, purpose) {
  await connectDB();

  // Tracking: only email addresses that actually have a ticket. The caller answers
  // identically either way, so this cannot be used to discover who filed.
  if (purpose === 'track' && !(await Grievance.exists({ email }))) return { ok: true };

  const existing = await OtpCode.findOne({ key: email, purpose }).lean();
  if (existing && Date.now() - new Date(existing.lastSentAt).getTime() < RESEND_MS) {
    return { ok: false, wait: Math.ceil((RESEND_MS - (Date.now() - new Date(existing.lastSentAt).getTime())) / 1000) };
  }

  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  await OtpCode.findOneAndUpdate(
    { key: email, purpose },
    { codeHash: hash(email, purpose, code), attempts: 0, lastSentAt: new Date(), expiresAt: new Date(Date.now() + TTL_MS) },
    { upsert: true }
  );
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const mail = otpEmail({ code, minutes: TTL_MS / 60000, siteUrl });
  await sendEmail(email, mail.subject, mail.text, mail.html);
  const dev = process.env.NODE_ENV !== 'production' && !process.env.SMTP_HOST;
  return { ok: true, ...(dev ? { devCode: code } : {}) };
}

/** Checks a code. On success returns a short-lived signed token proving the address. */
export async function verifyOtp(email, purpose, code) {
  await connectDB();
  const row = await OtpCode.findOne({ key: email, purpose });
  if (!row || row.expiresAt < new Date()) return { ok: false, error: 'Code expired. Please request a new one.' };
  if (row.attempts >= MAX_ATTEMPTS) return { ok: false, error: 'Too many wrong attempts. Please request a new code.' };

  const given = Buffer.from(hash(email, purpose, String(code || '').trim()));
  const real = Buffer.from(row.codeHash);
  if (given.length !== real.length || !crypto.timingSafeEqual(given, real)) {
    row.attempts += 1;
    await row.save();
    return { ok: false, error: 'Incorrect code' };
  }
  await OtpCode.deleteOne({ _id: row._id }); // one use only
  const token = await signTypedToken('otp', { key: email, purpose }, purpose === 'file' ? '30m' : '15m');
  return { ok: true, token };
}

/** True when `token` is a valid OTP proof for exactly this email and purpose. */
export async function checkOtpToken(token, email, purpose) {
  const p = await verifyTypedToken(token, 'otp');
  return !!p && p.purpose === purpose && p.key === email;
}
