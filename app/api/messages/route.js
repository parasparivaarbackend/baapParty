import { NextResponse } from 'next/server';
import { requireAdmin, SUPER_ONLY } from '@/lib/adminSession';
import { getUserSession } from '@/lib/userSession';
import { getMessages, createMessage } from '@/lib/db/messages';
import { readNames } from '@/lib/personName';
import { checkWords } from '@/lib/wordLimit';
import { notifySubmission } from '@/lib/notify/submissions';

export async function GET(req) {
  const auth = await requireAdmin(req, SUPER_ONLY);
  if (auth.error) return auth.error;
  const items = await getMessages();
  return NextResponse.json(items);
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const names = readNames(body);
  if (!names.firstName || !body?.email || !body?.message) {
    return NextResponse.json({ error: 'First name, email and message are required' }, { status: 400 });
  }
  Object.assign(body, names);
  const words = checkWords(body.message);
  if (words.error) return NextResponse.json({ error: words.error }, { status: 400 });
  body.message = words.text;
  // Link this submission to the logged-in member (if any) so it shows on their
  // dashboard. userId always comes from the verified cookie, never from the client.
  delete body.userId;
  if (!['Query', 'Complaint', 'Suggestion'].includes(body.type)) body.type = 'Query';
  const session = await getUserSession(req);
  if (session?.sub) {
    body.userId = String(session.sub);
  }
  const item = await createMessage(body);
  await notifySubmission('contact', item); // confirmation mail to the sender; never throws
  return NextResponse.json(item, { status: 201 });
}
