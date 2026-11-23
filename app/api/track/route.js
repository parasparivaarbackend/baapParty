import { NextResponse } from 'next/server';
import { trackGrievance } from '@/lib/db/grievances';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { isOtpEnabled, cleanEmail, isValidEmail } from '@/lib/otp';
import { verifyTypedToken } from '@/lib/auth';

export async function POST(req) {
  if (!rateLimit(`trk:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again in a few minutes.' }, { status: 429 });
  }
  const b = await req.json().catch(() => ({}));
  if (!b.ticketId) return NextResponse.json({ error: 'Enter your ticket number' }, { status: 400 });

  let email;
  if (isOtpEnabled()) {
    // The address was proven by an emailed code; the token carries it.
    const t = await verifyTypedToken(b.otpToken, 'otp');
    if (!t || t.purpose !== 'track') return NextResponse.json({ error: 'Please verify your email with the OTP' }, { status: 400 });
    email = t.key;
  } else {
    email = cleanEmail(b.email);
    if (!isValidEmail(email)) return NextResponse.json({ error: 'Enter your ticket number and the email you used' }, { status: 400 });
  }

  const result = await trackGrievance(b.ticketId, { email });
  // Same message for "no such ticket" and "wrong email" so tickets can't be probed.
  if (!result) return NextResponse.json({ error: 'No ticket found with these details' }, { status: 404 });
  return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
}
