// Shared helpers for the First Name / Last Name fields.
//
// The database keeps `firstName`, `lastName` AND a joined `name`, so older
// records (which only have `name`) and every place that still prints `name`
// (emails, exports, admin lists) keep working.

const clean = (v, max = 50) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

export function splitName(full = '') {
  const parts = clean(full, 100).split(' ').filter(Boolean);
  if (!parts.length) return { firstName: '', lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

export function joinName(first = '', last = '') {
  return [clean(first), clean(last)].filter(Boolean).join(' ');
}

/** First/last name of any record - new ones have both fields, old ones are split from `name`. */
export function namesOf(rec) {
  if (!rec) return { firstName: '', lastName: '' };
  if (rec.firstName || rec.lastName) return { firstName: rec.firstName || '', lastName: rec.lastName || '' };
  return splitName(rec.name);
}

/** Display name for lists / emails. */
export function displayName(rec) {
  if (!rec) return '';
  return rec.name || joinName(rec.firstName, rec.lastName);
}

/** Server side: read names from a request body (also accepts a legacy `name`). */
export function readNames(body) {
  let firstName = clean(body?.firstName);
  let lastName = clean(body?.lastName);
  if (!firstName && !lastName && body?.name) ({ firstName, lastName } = splitName(body.name));
  return { firstName, lastName, name: joinName(firstName, lastName) };
}
