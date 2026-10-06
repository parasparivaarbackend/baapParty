import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/mongoose';
import Admin from '@/models/Admin';
import { signTypedToken, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from '@/lib/auth';
import { rateLimit, clientIp } from '@/lib/rateLimit';

// Compared against when the username does not exist, so "unknown user" and "wrong password"
// take the same time and cannot be told apart.
const DUMMY_HASH = '$2a$10$z15MSIsPlUjvVMAEerpRVuGHqe9c2SmapsilG8uwENw0b7.VGibD2';
const INVALID = { error: 'Invalid username or password' };

export async function POST(req) {
  // Brute-force protection: per IP, and a looser per-username cap so one name cannot be hammered
  // from many IPs.
  if (!rateLimit(`alogin-ip:${clientIp(req)}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many login attempts. Please try again in a few minutes.' }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const username = String(body?.username || '').trim().toLowerCase().slice(0, 60);
  const password = String(body?.password || '').slice(0, 200);

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
  }
  if (!rateLimit(`alogin-user:${username}`, 15, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many login attempts. Please try again in a few minutes.' }, { status: 429 });
  }

  // Real problems (bad env, DB down) go to the server log only - never to the browser.
  let admin;
  try {
    await connectDB();
    admin = await Admin.findOne({ username }).lean();
  } catch (err) {
    console.error('[admin login] DB error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }

  const valid = await bcrypt.compare(password, admin?.passwordHash || DUMMY_HASH);
  if (!admin || !valid) return NextResponse.json(INVALID, { status: 401 });

  let token;
  try {
    token = await signTypedToken('admin', { sub: String(admin._id), username: admin.username, role: admin.role || 'super' }, '7d');
  } catch (err) {
    console.error('[admin login] token error (is JWT_SECRET set?):', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }

  const res = NextResponse.json({ success: true, username: admin.username, role: admin.role || 'super' });
  res.cookies.set(AUTH_COOKIE_NAME, token, { ...AUTH_COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 7 });
  return res;
}
