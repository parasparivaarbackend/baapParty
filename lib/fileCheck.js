// Server-side checks for admin uploads. The browser's MIME type / file name can be faked, so the
// real type is read from the first bytes of the file ("magic bytes").

const MB = 1024 * 1024;

export const LIMITS = {
  image: 10 * MB,
  // Cloud Run rejects whole requests above 32 MB, so keep video comfortably under that.
  video: 30 * MB,
};

function sniff(b) {
  if (b.length < 12) return null;
  const ascii = (from, to) => b.slice(from, to).toString('latin1');
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { kind: 'image', type: 'jpg' };
  if (b[0] === 0x89 && ascii(1, 4) === 'PNG') return { kind: 'image', type: 'png' };
  if (ascii(0, 3) === 'GIF') return { kind: 'image', type: 'gif' };
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return { kind: 'image', type: 'webp' };
  if (ascii(4, 8) === 'ftyp') {
    const brand = ascii(8, 12);
    if (brand === 'avif' || brand === 'avis') return { kind: 'image', type: 'avif' };
    if (brand === 'qt  ') return { kind: 'video', type: 'mov' };
    // mp4 family: isom, mp41, mp42, M4V, avc1, ...
    if (!/^(heic|heix|mif1|msf1)/.test(brand)) return { kind: 'video', type: 'mp4' };
  }
  if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return { kind: 'video', type: 'webm' };
  return null;
}

/**
 * Checks an uploaded File. `kinds` is the allowed list, e.g. ['image'] or ['image', 'video'].
 * Returns { ok: true, kind, type } or { ok: false, error }.
 */
export async function checkMediaFile(file, kinds = ['image']) {
  if (!file || typeof file === 'string') return { ok: false, error: 'File is required' };
  if (!file.size) return { ok: false, error: 'The file is empty' };
  const found = sniff(Buffer.from(await file.slice(0, 32).arrayBuffer()));
  if (!found || !kinds.includes(found.kind)) {
    const allowed = [kinds.includes('image') && 'JPG, PNG, GIF, WEBP or AVIF images', kinds.includes('video') && 'MP4, MOV or WEBM videos']
      .filter(Boolean).join(' and ');
    return { ok: false, error: `Only ${allowed} are allowed` };
  }
  const max = LIMITS[found.kind];
  if (file.size > max) return { ok: false, error: `${found.kind === 'video' ? 'Video' : 'Image'} is larger than ${max / MB} MB` };
  return { ok: true, ...found };
}

/** Folder names go into the Cloudinary path - keep them to simple words. */
export const safeFolder = (raw) => (/^[a-z0-9_-]{1,30}$/i.test(String(raw || '')) ? String(raw).toLowerCase() : 'misc');
