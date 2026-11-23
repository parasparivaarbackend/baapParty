import { NextResponse } from 'next/server';
import { saveSecureFile } from '@/lib/upload';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { detectDocType } from '@/lib/fileCheck';

const MAX_BYTES = 5 * 1024 * 1024;

// Public (donate page), but restricted: PDF / JPG / PNG only, 5 MB max, rate-limited per IP.
// Payment screenshots are stored privately (no public URL) - only an admin can open them.
export async function POST(req) {
  if (!rateLimit(`cupl:${clientIp(req)}`, 6, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many uploads. Please try again later.' }, { status: 429 });
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || typeof file === 'string') return NextResponse.json({ error: 'File is required' }, { status: 400 });
  if (!file.size) return NextResponse.json({ error: 'The file is empty' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File is larger than 5 MB' }, { status: 400 });

  const head = Buffer.from(await file.slice(0, 16).arrayBuffer());
  if (!detectDocType(head)) return NextResponse.json({ error: 'Only JPG, PNG or PDF files are allowed' }, { status: 400 });

  try {
    const screenshot = await saveSecureFile(file, 'contribution-proof');
    return NextResponse.json({ screenshot }, { status: 201 });
  } catch (err) {
    console.error('contribution screenshot upload failed', err);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
