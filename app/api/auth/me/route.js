import { NextResponse } from 'next/server';
import { verifyTypedToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET(req) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = await verifyTypedToken(token, 'admin');
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, username: payload.username, role: payload.role || 'super' });
}
