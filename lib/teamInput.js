import { INDIAN_STATES } from '@/lib/locations';
import { normalizeDistrict } from '@/lib/grievanceConfig';

const SOCIAL_HOSTS = {
  facebook: { base: 'https://facebook.com/', hosts: ['facebook.com', 'fb.com', 'fb.me'] },
  instagram: { base: 'https://instagram.com/', hosts: ['instagram.com'] },
  twitter: { base: 'https://x.com/', hosts: ['x.com', 'twitter.com'] },
};

/** '' (empty), or a clean https URL on the right site. A plain @handle is turned into a link. */
function socialUrl(kind, raw) {
  const v = String(raw || '').trim().slice(0, 200);
  if (!v) return '';
  const { base, hosts } = SOCIAL_HOSTS[kind];
  if (/^@?[A-Za-z0-9._-]{2,60}$/.test(v)) return base + v.replace(/^@/, '');
  let u;
  try { u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`); } catch { throw new Error(`Enter a valid ${kind === 'twitter' ? 'X' : kind} link`); }
  const host = u.hostname.replace(/^(www|m|mobile)\./, '');
  if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new Error(`Enter a valid ${kind === 'twitter' ? 'X' : kind} link`);
  if (!hosts.includes(host)) throw new Error(`That is not a ${kind === 'twitter' ? 'X' : kind} link`);
  u.protocol = 'https:';
  return u.toString();
}

/** Photo must be an https link (our Cloudinary upload, or a pasted link). */
function photoUrl(raw) {
  const v = String(raw || '').trim().slice(0, 500);
  if (!v) return '';
  let u;
  try { u = new URL(v); } catch { throw new Error('Photo must be a valid https link'); }
  if (u.protocol !== 'https:') throw new Error('Photo must be a valid https link');
  return u.toString();
}

/** Validates a team-member payload. Returns { data } or { error }. */
export function parseTeamInput(b, { partial = false } = {}) {
  const out = {};
  const need = (cond, msg) => { if (!cond) throw new Error(msg); };
  try {
    if (!partial || b.wing !== undefined) { need(['youth', 'women'].includes(b.wing), 'Choose a wing'); out.wing = b.wing; }
    if (!partial || b.state !== undefined) { need(INDIAN_STATES.includes(b.state), 'Choose a state'); out.state = b.state; }
    if (!partial || b.district !== undefined) { const d = normalizeDistrict(b.district); need(d.length >= 2, 'Enter the district'); out.district = d; }
    if (!partial || b.name !== undefined) { const n = String(b.name || '').trim().slice(0, 80); need(n.length >= 2, 'Enter the name'); out.name = n; }
    if (!partial || b.designation !== undefined) { const d = String(b.designation || '').trim().slice(0, 80); need(d.length >= 2, 'Enter the designation'); out.designation = d; }
    if (b.phone !== undefined) { const p = String(b.phone || '').replace(/\D/g, '').slice(-10); need(p === '' || /^[6-9]\d{9}$/.test(p), 'Enter a valid 10-digit mobile number'); out.phone = p; }
    if (b.email !== undefined) { const e = String(b.email || '').trim(); need(e === '' || /^\S+@\S+\.\S+$/.test(e), 'Enter a valid email'); out.email = e; }
    if (b.photo !== undefined) out.photo = photoUrl(b.photo);
    for (const k of ['facebook', 'instagram', 'twitter']) if (b[k] !== undefined) out[k] = socialUrl(k, b[k]);
    if (b.showContact !== undefined) out.showContact = b.showContact === true;
    if (b.isActive !== undefined) out.isActive = b.isActive === true;
    if (b.order !== undefined) { const o = Number(b.order); out.order = Number.isFinite(o) ? Math.max(0, Math.min(9999, Math.round(o))) : 100; }
    return { data: out };
  } catch (err) {
    return { error: err.message };
  }
}
