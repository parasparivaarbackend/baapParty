import { SignJWT, jwtVerify } from 'jose';

export const AUTH_COOKIE_NAME = 'admin_token';
export const USER_AUTH_COOKIE_NAME = 'user_token';

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set. Add it to .env.local (see .env.local.example).');
  }
  return new TextEncoder().encode(secret);
}

/** Signs a JWT for an admin session. payload should be small, e.g. { sub: adminId, username }. */
export async function signAuthToken(payload, expiresIn = '7d') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecretKey());
}

/** Verifies a JWT. Returns the decoded payload, or null if invalid/expired. */
export async function verifyAuthToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

/**
 * Tokens carry a `typ` claim ('admin' | 'user' | 'otp') and are only accepted for
 * their own purpose. All of them are signed with the same secret, so without this
 * a logged-in site user could paste their own token into the admin cookie.
 */
export async function signTypedToken(typ, payload, expiresIn) {
  return signAuthToken({ ...payload, typ }, expiresIn);
}

export async function verifyTypedToken(token, typ) {
  const payload = await verifyAuthToken(token);
  return payload && payload.typ === typ ? payload : null;
}

/** Shared cookie options for setting/clearing the admin session cookie. */
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};
