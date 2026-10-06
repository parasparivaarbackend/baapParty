import { NextResponse } from 'next/server';
import { verifyTypedToken, USER_AUTH_COOKIE_NAME } from '@/lib/auth';
import { getUserById } from '@/lib/db/users';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const token = req.cookies.get(USER_AUTH_COOKIE_NAME)?.value;
  const payload = await verifyTypedToken(token, 'user');
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Prefer fresh data from the DB (so a renamed profile shows immediately);
  // fall back to the token if the DB is unreachable.
  let user = null;
  try {
    user = await getUserById(payload.sub);
  } catch {
    user = null;
  }

  return NextResponse.json(
    {
      authenticated: true,
      id: String(payload.sub),
      name: user?.name || payload.name,
      email: user?.email || payload.email,
      phone: user?.phone || '',
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
