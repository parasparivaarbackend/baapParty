import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/lib/db/users';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { signTypedToken, USER_AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from '@/lib/auth';

const DUMMY_HASH = '$2a$10$z15MSIsPlUjvVMAEerpRVuGHqe9c2SmapsilG8uwENw0b7.VGibD2';

export async function POST(req) {
  if (!rateLimit(`ulogin-ip:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many login attempts. Please try again in a few minutes.' }, { status: 429 });
  }
  const body = await req.json().catch(() => ({}));
  const email = (body?.email || '').trim().toLowerCase();
  const password = body?.password || '';

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  if (!rateLimit(`ulogin-user:${email}`, 15, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many login attempts. Please try again in a few minutes.' }, { status: 429 });
  }

  const user = await getUserByEmail(email);
  const valid = await bcrypt.compare(password.slice(0, 200), user?.passwordHash || DUMMY_HASH);
  if (!user || !valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = await signTypedToken('user', { sub: String(user._id), name: user.name, email: user.email });

  const res = NextResponse.json({ success: true, user: { id: String(user._id), name: user.name, email: user.email } });
  res.cookies.set(USER_AUTH_COOKIE_NAME, token, { ...AUTH_COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 30 });
  return res;
}
