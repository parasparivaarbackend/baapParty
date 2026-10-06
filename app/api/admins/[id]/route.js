import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/mongoose';
import Admin from '@/models/Admin';
import { getAdmin } from '@/lib/adminSession';

// Reset an officer's password (super admins only).
export async function PATCH(req, { params }) {
  const me = await getAdmin(req);
  if (me?.role !== 'super') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { password } = await req.json().catch(() => ({}));
  if (String(password || '').length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  await connectDB();
  try {
    const a = await Admin.findByIdAndUpdate(params.id, { passwordHash: await bcrypt.hash(String(password), 10) });
    if (!a) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch { return NextResponse.json({ error: 'Not found' }, { status: 404 }); }
  return NextResponse.json({ success: true });
}

// Delete an account. You cannot delete yourself or the last super admin.
export async function DELETE(req, { params }) {
  const me = await getAdmin(req);
  if (me?.role !== 'super') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (params.id === me.id) return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
  await connectDB();
  try {
    const target = await Admin.findById(params.id).lean();
    if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if ((target.role || 'super') === 'super') {
      const supers = await Admin.countDocuments({ $or: [{ role: 'super' }, { role: { $exists: false } }] });
      if (supers <= 1) return NextResponse.json({ error: 'Cannot delete the last super admin' }, { status: 400 });
    }
    await Admin.findByIdAndDelete(params.id);
  } catch { return NextResponse.json({ error: 'Not found' }, { status: 404 }); }
  return NextResponse.json({ success: true });
}
