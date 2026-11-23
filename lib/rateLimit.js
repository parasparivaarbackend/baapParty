// Tiny in-memory rate limiter (per server instance). Good enough to slow down
// casual abuse; on serverless/multi-instance hosting use Upstash/Redis instead.
const buckets = new Map();

export function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return true;
}

/**
 * Client IP for rate limiting. Anyone can send their own X-Forwarded-For, but every proxy in
 * front of the app APPENDS the address it saw, so only entries counted from the RIGHT can be
 * trusted. TRUSTED_PROXY_HOPS = number of proxies you own/trust in front of the app:
 *   1 = Cloud Run directly (default)    2 = Cloud Run behind a Google HTTPS load balancer
 * Without any proxy header (local dev) this returns 'unknown'.
 */
export function clientIp(req) {
  const parts = (req.headers.get('x-forwarded-for') || '').split(',').map((x) => x.trim()).filter(Boolean);
  const hops = Math.max(1, Number(process.env.TRUSTED_PROXY_HOPS || 1));
  return parts[parts.length - hops] || parts[0] || 'unknown';
}
