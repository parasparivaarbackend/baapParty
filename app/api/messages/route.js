import { NextResponse } from 'next/server';
import { requireAdmin, SUPER_ONLY } from '@/lib/adminSession';
import { getUserSession } from '@/lib/userSession';
import { getMessages, createMessage } from '@/lib/db/messages';

export async function GET(req) {
  const auth = await requireAdmin(req, SUPER_ONLY);
  if (auth.error) return auth.error;
  const items = await getMessages();
  return NextResponse.json(items);
}

export async function POST(req) {
  const body = await req.json();
  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
  }
  // Link this submission to the logged-in member (if any) so it shows on their
  // dashboard. userId always comes from the verified cookie, never from the client.
  delete body.userId;
  if (!['Query', 'Complaint', 'Suggestion'].includes(body.type)) body.type = 'Query';
  const session = await getUserSession(req);
  if (session?.sub) {
    body.userId = String(session.sub);
  }
  const item = await createMessage(body);
  return NextResponse.json(item, { status: 201 });
}
