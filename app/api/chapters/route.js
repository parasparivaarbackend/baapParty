import { NextResponse } from 'next/server';
import { requireAdmin, CONTENT_ROLES } from '@/lib/adminSession';
import { getAllChapters, getPublicChapters, createChapter } from '@/lib/db/chapters';

// Public: published chapters. Admin (?all=1): every chapter incl. drafts.
export async function GET(req) {
  if (new URL(req.url).searchParams.get('all')) {
    const auth = await requireAdmin(req, CONTENT_ROLES);
    if (auth.error) return auth.error;
    try {
      return NextResponse.json(await getAllChapters());
    } catch (err) {
      console.error('chapters GET', err);
      return NextResponse.json({ error: 'Could not load chapters' }, { status: 500 });
    }
  }
  return NextResponse.json(await getPublicChapters());
}

export async function POST(req) {
  const auth = await requireAdmin(req, CONTENT_ROLES);
  if (auth.error) return auth.error;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const res = await createChapter(body);
  if (res.error) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json(res.item, { status: 201 });
}
