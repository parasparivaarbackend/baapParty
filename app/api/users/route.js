import { NextResponse } from 'next/server';
import { requireAdmin, SUPER_ONLY } from '@/lib/adminSession';
import { getUsers } from '@/lib/db/users';

// Admin-only, always-fresh list — never statically cached/prerendered.
export const dynamic = 'force-dynamic';

export async function GET(req) {
  const auth = await requireAdmin(req, SUPER_ONLY);
  if (auth.error) return auth.error;
  const items = await getUsers();
  return NextResponse.json(items);
}
