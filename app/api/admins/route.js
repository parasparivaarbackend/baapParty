import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/mongoose';
import Admin from '@/models/Admin';
import { getAdmin } from '@/lib/adminSession';

const ROLES = ['super', 'youth_officer', 'women_officer', 'content_manager'];

// Super admins only: list / create admin & officer accounts.
export async function GET(req) {
  const me = await getAdmin(req);
  if (me?.role !== 'super') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectDB();
  const list = await Admin.find().sort({ createdAt: 1 }).select('username role createdAt').lean();
  return NextResponse.json(list.map((a) => ({ id: String(a._id), username: a.username, role: a.role || 'super', createdAt: a.createdAt })));
}

export async function POST(req) {
  const me = await getAdmin(req);
  if (me?.role !== 'super') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const b = await req.json().catch(() => ({}));
  const username = String(b.username || '').trim().toLowerCase();
  const password = String(b.password || '');
  if (!/^[a-z0-9._-]{3,30}$/.test(username)) return NextResponse.json({ error: 'Username: 3–30 letters, numbers, . _ -' }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  if (!ROLES.includes(b.role)) return NextResponse.json({ error: 'Choose a valid role' }, { status: 400 });
  await connectDB();
  if (await Admin.exists({ username })) return NextResponse.json({ error: 'That username is already taken' }, { status: 409 });
  const a = await Admin.create({ username, role: b.role, passwordHash: await bcrypt.hash(password, 10) });
  return NextResponse.json({ id: String(a._id), username: a.username, role: a.role }, { status: 201 });
}
