import { NextResponse } from 'next/server';
import { USER_AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from '@/lib/auth';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(USER_AUTH_COOKIE_NAME, '', { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
  return res;
}
