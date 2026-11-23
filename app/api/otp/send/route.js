import { NextResponse } from 'next/server';
import { sendOtp, cleanEmail, isValidEmail, isOtpEnabled } from '@/lib/otp';
import { rateLimit, clientIp } from '@/lib/rateLimit';

export async function POST(req) {
  if (!isOtpEnabled()) return NextResponse.json({ error: 'OTP verification is not enabled' }, { status: 404 });
  const b = await req.json().catch(() => ({}));
  const email = cleanEmail(b.email);
  const purpose = b.purpose;
  if (!isValidEmail(email) || !['file', 'track'].includes(purpose)) {
    return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
  }
  // Limits protect both the mail quota and the person whose address is typed in.
  if (!rateLimit(`otp-ip:${clientIp(req)}`, 10, 10 * 60 * 1000) || !rateLimit(`otp-em:${email}`, 3, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many codes requested. Please try again in a few minutes.' }, { status: 429 });
  }
  try {
    const r = await sendOtp(email, purpose);
    if (!r.ok) return NextResponse.json({ error: `Please wait ${r.wait}s before asking for another code.` }, { status: 429 });
    return NextResponse.json({ ok: true, expiresInSeconds: 300, ...(r.devCode ? { devCode: r.devCode } : {}) });
  } catch (err) {
    console.error('otp send failed', err);
    return NextResponse.json({ error: 'Could not send the code. Please try again.' }, { status: 500 });
  }
}
