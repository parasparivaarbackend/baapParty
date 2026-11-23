import { NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/upload';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { detectDocType, checkMediaFile } from '@/lib/fileCheck';

const MB = 1024 * 1024;
const MAX_DOC = 5 * MB; // PDF / JPG / PNG
const MAX_VIDEO = 25 * MB; // keeps the request under Cloud Run's 32 MB limit

// Public, but restricted: PDF / JPG / PNG (5 MB) or MP4 / MOV / WEBM video (25 MB), rate-limited per IP.
// The real file signature is checked, not the file name or the claimed MIME type.
export async function POST(req) {
  if (!rateLimit(`upl:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many uploads. Please try again later.' }, { status: 429 });
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || typeof file === 'string') return NextResponse.json({ error: 'File is required' }, { status: 400 });
  if (!file.size) return NextResponse.json({ error: 'The file is empty' }, { status: 400 });

  const head = Buffer.from(await file.slice(0, 32).arrayBuffer());
  let kind = null;
  if (detectDocType(head)) {
    kind = 'document';
    if (file.size > MAX_DOC) return NextResponse.json({ error: 'File is larger than 5 MB' }, { status: 400 });
  } else {
    const media = await checkMediaFile(file, ['video']);
    if (!media.ok) return NextResponse.json({ error: 'Only PDF, JPG, PNG or MP4 / MOV / WEBM video files are allowed' }, { status: 400 });
    kind = 'video';
    if (file.size > MAX_VIDEO) return NextResponse.json({ error: 'Video is larger than 25 MB. Please share a link instead.' }, { status: 400 });
  }

  try {
    const url = await saveUploadedFile(file, 'grievances');
    return NextResponse.json({ url, kind }, { status: 201 });
  } catch (err) {
    console.error('grievance upload failed', err);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
