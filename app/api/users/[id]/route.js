import { NextResponse } from 'next/server';
import { requireAdmin, SUPER_ONLY } from '@/lib/adminSession';
import { deleteUser } from '@/lib/db/users';

export async function DELETE(req, { params }) {
  const auth = await requireAdmin(req, SUPER_ONLY);
  if (auth.error) return auth.error;
  const ok = await deleteUser(params.id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
