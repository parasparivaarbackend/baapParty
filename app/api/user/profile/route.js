import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/userSession';
import { connectDB, serialize } from '@/lib/db/mongoose';
import User from '@/models/User';
import { readNames } from '@/lib/personName';

export async function PUT(req) {
  const session = await getUserSession(req);
  if (!session?.sub) {
    return NextResponse.json({ error: 'Please log in' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { firstName, lastName, name } = readNames(body);
  if (!firstName) {
    return NextResponse.json({ error: 'First name is required' }, { status: 400 });
  }

  // Only these fields can be edited. Email/password are intentionally not editable here.
  const update = {
    firstName,
    lastName,
    name,
    phone: String(body?.phone ?? '').trim(),
    address: String(body?.address ?? '').trim(),
    city: String(body?.city ?? '').trim(),
    state: String(body?.state ?? '').trim(),
  };

  await connectDB();
  try {
    const doc = await User.findByIdAndUpdate(session.sub, update, { new: true }).select('-passwordHash').lean();
    if (!doc) return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    return NextResponse.json({ success: true, profile: serialize(doc) });
  } catch {
    return NextResponse.json({ error: 'Could not update profile' }, { status: 500 });
  }
}
