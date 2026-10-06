import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/userSession';
import { connectDB, serialize } from '@/lib/db/mongoose';
import User from '@/models/User';

export async function PUT(req) {
  const session = await getUserSession(req);
  if (!session?.sub) {
    return NextResponse.json({ error: 'Please log in' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name = String(body?.name ?? '').trim();
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  // Only these fields can be edited. Email/password are intentionally not editable here.
  const update = {
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
