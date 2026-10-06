import { NextResponse } from 'next/server';
import { requireAdmin, SUPER_ONLY } from '@/lib/adminSession';
import { getUserSession } from '@/lib/userSession';
import { getVolunteers, createVolunteer } from '@/lib/db/volunteers';

export async function GET(req) {
  const auth = await requireAdmin(req, SUPER_ONLY);
  if (auth.error) return auth.error;
  const items = await getVolunteers();
  return NextResponse.json(items);
}

export async function POST(req) {
  const body = await req.json();
  if (!body?.name || !body?.phone || !body?.email) {
    return NextResponse.json({ error: 'Name, phone and email are required' }, { status: 400 });
  }
  // Link this submission to the logged-in member (if any) so it shows on their
  // dashboard. userId always comes from the verified cookie, never from the client.
  delete body.userId;
  const session = await getUserSession(req);
  if (session?.sub) {
    body.userId = String(session.sub);
  }
  const item = await createVolunteer(body);
  return NextResponse.json(item, { status: 201 });
}
