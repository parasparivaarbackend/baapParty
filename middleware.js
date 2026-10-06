import { NextResponse } from 'next/server';
import { verifyTypedToken, AUTH_COOKIE_NAME, USER_AUTH_COOKIE_NAME } from '@/lib/auth';

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login']);

// GETs that the public website itself needs (home page, /events, /blog, /gallery)
// stay open. Everything else under these prefixes (create/update/delete) is
// admin-only and requires the session cookie.
const PUBLIC_GET_PREFIXES = ['/api/events', '/api/blog', '/api/gallery'];

// Public-facing forms (volunteer signup, donation pledge, contact form) must
// stay open for POST so visitors can submit them without logging in.
const PUBLIC_POST_PATHS = new Set([
  '/api/volunteers',
  '/api/contributions',
  '/api/messages',
  '/api/grievances', // filing a problem (GET stays admin-only)
  '/api/track', // public ticket status lookup (needs ticket + phone last 4)
  '/api/grievance-upload', // restricted public upload (PDF/JPG/PNG, 5 MB)
  '/api/otp/send', // mobile OTP (rate-limited)
  '/api/otp/verify',
]);

function isPublicApiRequest(pathname, method) {
  if (pathname.startsWith('/api/auth/')) return true;
  if (pathname.startsWith('/api/user-auth/')) return true;
  // /api/user/* checks the *user* cookie inside each route handler
  if (pathname.startsWith('/api/user/')) return true;
  if (pathname === '/api/filters') return true;

  if (method === 'GET' && PUBLIC_GET_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }

  if (method === 'POST' && PUBLIC_POST_PATHS.has(pathname)) {
    return true;
  }

  return false;
}

async function getAdminPayload(request) {
  return verifyTypedToken(request.cookies.get(AUTH_COOKIE_NAME)?.value, 'admin');
}

// Everyone except a super admin is limited to a few sections. This is the coarse first
// gate; routes re-check the role against the database where it matters.
//   youth_officer / women_officer -> Grievances only
//   content_manager               -> Events, Blog / Press, Gallery (+ the media uploader)
const ROLE_ACCESS = {
  youth_officer: { pages: ['/admin/grievances'], apis: ['/api/grievances'], home: '/admin/grievances' },
  women_officer: { pages: ['/admin/grievances'], apis: ['/api/grievances'], home: '/admin/grievances' },
  content_manager: {
    pages: ['/admin/events', '/admin/blog', '/admin/gallery'],
    apis: ['/api/events', '/api/blog', '/api/gallery', '/api/upload'],
    home: '/admin/events',
  },
};
// A role we do not know gets nothing (and lands on a harmless page) instead of full access.
const NO_ACCESS = { pages: [], apis: [], home: '/admin/login' };
const accessFor = (role) => (role === 'super' ? null : ROLE_ACCESS[role] || NO_ACCESS);
const underAny = (pathname, prefixes) => prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Member dashboard: must be logged in as a site user
  if (pathname.startsWith('/dashboard')) {
    const payload = await verifyTypedToken(request.cookies.get(USER_AUTH_COOKIE_NAME)?.value, 'user');
    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (PUBLIC_ADMIN_PATHS.has(pathname)) {
      return NextResponse.next();
    }
    const admin = await getAdminPayload(request);
    if (!admin) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    const access = accessFor(admin.role || 'super');
    if (access && !underAny(pathname, access.pages)) {
      return NextResponse.redirect(new URL(access.home, request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/api')) {
    if (isPublicApiRequest(pathname, request.method)) {
      return NextResponse.next();
    }
    const admin = await getAdminPayload(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const access = accessFor(admin.role || 'super');
    if (access && !underAny(pathname, access.apis)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*', '/dashboard/:path*'],
};
