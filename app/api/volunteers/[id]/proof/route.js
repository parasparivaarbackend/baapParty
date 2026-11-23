import { NextResponse } from 'next/server';
import { requireAdmin, SUPER_ONLY } from '@/lib/adminSession';
import { getVolunteerById } from '@/lib/db/volunteers';
import { signedUrl } from '@/lib/upload';

export const dynamic = 'force-dynamic';

// Opens a volunteer's age / ID proof. Admin-only: the file has no public URL, so we
// check the admin session first and then redirect to a signed Cloudinary link.
export async function GET(req, { params }) {
  const auth = await requireAdmin(req, SUPER_ONLY);
  if (auth.error) return auth.error;
  const { id } = await params;
  const v = await getVolunteerById(id);
  if (!v?.idProof?.publicId) return NextResponse.json({ error: 'No ID proof on file' }, { status: 404 });
  const res = NextResponse.redirect(signedUrl(v.idProof), 302);
  res.headers.set('Cache-Control', 'no-store');
  return res;
}
