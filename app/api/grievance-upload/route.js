import { NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/upload';
import { rateLimit, clientIp } from '@/lib/rateLimit';

const MAX_BYTES = 5 * 1024 * 1024;

// Check the real file signature, not just the claimed MIME type.
function detectType(buf) {
  if (buf.length > 4 && buf.slice(0, 4).toString() === '%PDF') return 'pdf';
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf.length > 8 && buf.slice(1, 4).toString() === 'PNG') return 'png';
  return null;
}

// Public, but restricted: PDF/JPG/PNG only, 5 MB max, rate-limited per IP.
export async function POST(req) {
  if (!rateLimit(`upl:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many uploads. Please try again later.' }, { status: 429 });
  }
  const form = await req.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') return NextResponse.json({ error: 'File is required' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File is larger than 5 MB' }, { status: 400 });

  const head = Buffer.from(await file.slice(0, 16).arrayBuffer());
  if (!detectType(head)) return NextResponse.json({ error: 'Only PDF, JPG or PNG files are allowed' }, { status: 400 });

  try {
    const url = await saveUploadedFile(file, 'grievances');
    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    console.error('grievance upload failed', err);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
