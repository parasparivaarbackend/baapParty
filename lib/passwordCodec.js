export function encodePassword(plain) {
  const bytes = new TextEncoder().encode(String(plain ?? ''));
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin);
}

export function readPassword(body) {
  const raw = String(body?.password ?? '');
  try {
    return Buffer.from(raw, 'base64').toString('utf8');
  } catch {
    return '';
  }
}
