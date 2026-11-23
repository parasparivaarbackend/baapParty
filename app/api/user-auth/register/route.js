import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail, createUser } from '@/lib/db/users';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { signTypedToken, USER_AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from '@/lib/auth';
import { readPassword } from "@/lib/passwordCodec";
import { readNames } from '@/lib/personName';

export async function POST(req) {
  if (!rateLimit(`ureg-ip:${clientIp(req)}`, 10, 30 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many sign-ups from this network. Please try again later.' }, { status: 429 });
  }
  const body = await req.json().catch(() => ({}));
  const { firstName, lastName, name } = readNames(body);
  const email = (body?.email || '').trim().toLowerCase();
  const phone = (body?.phone || '').trim();
  const password = readPassword(body);

  if (!firstName || !email || !password) {
    return NextResponse.json({ error: 'First name, email and password are required' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists. Please log in instead.' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ firstName, lastName, name, email, phone, passwordHash });

  const token = await signTypedToken('user', { sub: user.id, name: user.name, email: user.email });

  const res = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
  res.cookies.set(USER_AUTH_COOKIE_NAME, token, { ...AUTH_COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 30 });
  return res;
}
