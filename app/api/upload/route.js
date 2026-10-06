import { NextResponse } from 'next/server';
import { requireAdmin, CONTENT_ROLES } from '@/lib/adminSession';
import { saveUploadedFile } from '@/lib/upload';
import { checkMediaFile, safeFolder } from '@/lib/fileCheck';

// Generic single-file uploader used by admin forms (Events, Blog/Press, etc.)
// that need a "local upload" option alongside a plain URL/link field.
// Expects multipart/form-data: { file, folder? } -> { url }
// Accepts images (JPG/PNG/GIF/WEBP/AVIF, max 10 MB) and videos (MP4/MOV/WEBM, max 30 MB).
export async function POST(req) {
  const auth = await requireAdmin(req, CONTENT_ROLES);
  if (auth.error) return auth.error;

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const file = form.get('file');
  const folder = safeFolder(form.get('folder'));

  const check = await checkMediaFile(file, ['image', 'video']);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 });

  try {
    const url = await saveUploadedFile(file, folder);
    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    console.error('upload failed', err);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
