import { verifyTypedToken, USER_AUTH_COOKIE_NAME } from '@/lib/auth';

/** Returns the decoded JWT payload of the logged-in site user, or null. */
export async function getUserSession(req) {
  const token = req.cookies.get(USER_AUTH_COOKIE_NAME)?.value;
  return verifyTypedToken(token, 'user');
}
