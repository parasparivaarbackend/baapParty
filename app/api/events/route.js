import { NextResponse } from 'next/server';
import { requireAdmin, CONTENT_ROLES } from '@/lib/adminSession';
import { getEvents, createEvent } from '@/lib/db/events';

export async function GET() {
  const items = await getEvents();
  return NextResponse.json(items);
}

export async function POST(req) {
  const auth = await requireAdmin(req, CONTENT_ROLES);
  if (auth.error) return auth.error;
  const body = await req.json();
  if (!body?.title || !body?.date) {
    return NextResponse.json({ error: 'Title and date are required' }, { status: 400 });
  }
  const item = await createEvent(body);
  return NextResponse.json(item, { status: 201 });
}
