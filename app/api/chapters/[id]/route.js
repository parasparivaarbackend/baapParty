import { NextResponse } from 'next/server';
import { requireAdmin, CONTENT_ROLES } from '@/lib/adminSession';
import { getChapterById, updateChapter, deleteChapter } from '@/lib/db/chapters';

export async function GET(req, { params }) {
  const auth = await requireAdmin(req, CONTENT_ROLES);
  if (auth.error) return auth.error;
  const { id } = await params;
  const item = await getChapterById(id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req, { params }) {
  const auth = await requireAdmin(req, CONTENT_ROLES);
  if (auth.error) return auth.error;
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const res = await updateChapter(id, body);
  if (res.error) return NextResponse.json({ error: res.error }, { status: 400 });
  if (res.notFound) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(res.item);
}

export async function DELETE(req, { params }) {
  const auth = await requireAdmin(req, CONTENT_ROLES);
  if (auth.error) return auth.error;
  const { id } = await params;
  const ok = await deleteChapter(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
