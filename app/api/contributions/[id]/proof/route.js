import { NextResponse } from 'next/server';
import { requireAdmin, SUPER_ONLY } from '@/lib/adminSession';
import { getContributionById } from '@/lib/db/contributions';
import { signedUrl } from '@/lib/upload';

export const dynamic = 'force-dynamic';

// Opens a contribution's payment screenshot. Admin-only: the file has no public URL, so we
// check the admin session first and then redirect to a signed Cloudinary link.
export async function GET(req, { params }) {
  const auth = await requireAdmin(req, SUPER_ONLY);
  if (auth.error) return auth.error;
  const { id } = await params;
  const c = await getContributionById(id);
  if (!c?.screenshot?.publicId) return NextResponse.json({ error: 'No screenshot on file' }, { status: 404 });
  const res = NextResponse.redirect(signedUrl(c.screenshot), 302);
  res.headers.set('Cache-Control', 'no-store');
  return res;
}
