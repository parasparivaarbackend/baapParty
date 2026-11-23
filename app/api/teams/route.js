import { NextResponse } from 'next/server';
import { requireAdmin, SUPER_ONLY } from '@/lib/adminSession';
import { listTeamMembers, createTeamMember } from '@/lib/db/teams';
import { parseTeamInput } from '@/lib/teamInput';

// Admin-only (middleware). The public site reads teams server-side via lib/db/teams.
export async function GET(req) {
  const auth = await requireAdmin(req, SUPER_ONLY);
  if (auth.error) return auth.error;
  return NextResponse.json(await listTeamMembers());
}

export async function POST(req) {
  const auth = await requireAdmin(req, SUPER_ONLY);
  if (auth.error) return auth.error;
  const { data, error } = parseTeamInput(await req.json().catch(() => ({})));
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json(await createTeamMember(data), { status: 201 });
}
