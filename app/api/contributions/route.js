import { NextResponse } from 'next/server';
import { requireAdmin, SUPER_ONLY } from '@/lib/adminSession';
import { getUserSession } from '@/lib/userSession';
import { getContributions, createContribution } from '@/lib/db/contributions';

export async function GET(req) {
  const auth = await requireAdmin(req, SUPER_ONLY);
  if (auth.error) return auth.error;
  const items = await getContributions();
  return NextResponse.json(items);
}

export async function POST(req) {
  const body = await req.json();
  if (!body?.name || !body?.amount) {
    return NextResponse.json({ error: 'Name and amount are required' }, { status: 400 });
  }
  // Link this submission to the logged-in member (if any) so it shows on their
  // dashboard. userId always comes from the verified cookie, never from the client.
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email).trim())) {
    return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
  }
  if (body.email) body.email = String(body.email).trim().toLowerCase();
  delete body.userId;
  const session = await getUserSession(req);
  if (session?.sub) {
    body.userId = String(session.sub);
    if (!body.email && session.email) body.email = session.email;
  }
  const item = await createContribution(body);
  return NextResponse.json(item, { status: 201 });
}
