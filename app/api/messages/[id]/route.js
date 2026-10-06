import { NextResponse } from 'next/server';
import { requireAdmin, SUPER_ONLY } from '@/lib/adminSession';
import { updateMessage, deleteMessage } from '@/lib/db/messages';

export async function PATCH(req, { params }) {
  const auth = await requireAdmin(req, SUPER_ONLY);
  if (auth.error) return auth.error;
  const body = await req.json();
  const item = await updateMessage(params.id, body);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(req, { params }) {
  const auth = await requireAdmin(req, SUPER_ONLY);
  if (auth.error) return auth.error;
  const ok = await deleteMessage(params.id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
