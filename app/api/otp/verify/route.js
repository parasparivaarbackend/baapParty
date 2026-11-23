import { NextResponse } from 'next/server';
import { verifyOtp, cleanEmail, isValidEmail, isOtpEnabled } from '@/lib/otp';
import { rateLimit, clientIp } from '@/lib/rateLimit';

export async function POST(req) {
  if (!isOtpEnabled()) return NextResponse.json({ error: 'OTP verification is not enabled' }, { status: 404 });
  if (!rateLimit(`otpv:${clientIp(req)}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
  }
  const b = await req.json().catch(() => ({}));
  const email = cleanEmail(b.email);
  if (!isValidEmail(email) || !['file', 'track'].includes(b.purpose) || !/^\d{6}$/.test(String(b.code || '').trim())) {
    return NextResponse.json({ error: 'Enter the 6-digit code' }, { status: 400 });
  }
  const r = await verifyOtp(email, b.purpose, b.code);
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: 400 });
  return NextResponse.json({ ok: true, otpToken: r.token });
}
