import { NextResponse } from 'next/server';
import { verifyTypedToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { connectDB } from '@/lib/db/mongoose';
import Admin from '@/models/Admin';

export const ROLE_LABELS = {
  super: 'Super Admin',
  youth_officer: 'Youth Wing Officer',
  women_officer: 'Women Wing Officer',
  content_manager: 'Content Manager',
};

/** Wings of grievances a role may see. Sensitive women's cases fall under 'women'. */
export function allowedWings(role) {
  if (role === 'content_manager') return []; // never sees grievances
  if (role === 'women_officer') return ['women'];
  if (role === 'youth_officer') return ['youth', 'general'];
  return ['youth', 'women', 'general'];
}

/**
 * Returns { id, username, role } for the logged-in admin, or null. The role is
 * read from the database (not the cookie) so deleting or changing an officer
 * takes effect immediately instead of when their 7-day token expires.
 */
export async function getAdmin(req) {
  const payload = await verifyTypedToken(req.cookies.get(AUTH_COOKIE_NAME)?.value, 'admin');
  if (!payload?.sub) return null;
  try {
    await connectDB();
    const doc = await Admin.findById(payload.sub).select('username role').lean();
    if (!doc) return null;
    return { id: String(doc._id), username: doc.username, role: doc.role || 'super' };
  } catch {
    return null;
  }
}

/** Roles allowed to manage Events, Blog / Press, Gallery and the media uploader. */
export const CONTENT_ROLES = ['super', 'content_manager'];
export const SUPER_ONLY = ['super'];

/**
 * Route-level guard (second line of defence behind middleware.js).
 *   const auth = await requireAdmin(req, SUPER_ONLY);
 *   if (auth.error) return auth.error;
 * The role comes from the database, so a deleted / demoted admin loses access at once.
 */
export async function requireAdmin(req, roles = SUPER_ONLY) {
  const admin = await getAdmin(req);
  if (!admin) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  if (!roles.includes(admin.role)) return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  return { admin };
}
