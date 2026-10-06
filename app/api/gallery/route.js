import { NextResponse } from 'next/server';
import { requireAdmin, CONTENT_ROLES } from '@/lib/adminSession';
import { getGalleryItems, createGalleryItem } from '@/lib/db/gallery';
import { saveUploadedFile } from '@/lib/upload';
import { checkMediaFile } from '@/lib/fileCheck';
import { isYouTubeUrl, getYouTubeThumbnail } from '@/lib/youtube';

export async function GET() {
  const items = await getGalleryItems();
  return NextResponse.json(items);
}

// Expects multipart/form-data:
//   type: 'photo' | 'video'
//   file: the photo, or the video file (required for photos; required for
//         videos only when videoUrl isn't supplied instead)
//   videoUrl: a YouTube link — alternative to uploading a video `file`
//   thumbnail: an image file — optional for videos (auto-derived from
//              YouTube when videoUrl is a YouTube link and no thumbnail is sent)
//   caption, location, category: optional text fields
export async function POST(req) {
  const auth = await requireAdmin(req, CONTENT_ROLES);
  if (auth.error) return auth.error;
  const form = await req.formData();
  const type = form.get('type');
  const file = form.get('file');
  const thumbnailFile = form.get('thumbnail');
  const youtubeUrl = (form.get('videoUrl') || '').toString().trim();
  const caption = form.get('caption') || '';
  const location = form.get('location') || '';
  const state = form.get('state') || '';
  const city = form.get('city') || '';
  const category = form.get('category') || '';

  if (type !== 'photo' && type !== 'video') {
    return NextResponse.json({ error: "type must be 'photo' or 'video'" }, { status: 400 });
  }

  const hasFile = file && typeof file !== 'string';
  const hasThumbFile = thumbnailFile && typeof thumbnailFile !== 'string';

  if (type === 'photo') {
    if (!hasFile) {
      return NextResponse.json({ error: 'A photo file is required' }, { status: 400 });
    }
    const photoCheck = await checkMediaFile(file, ['image']);
    if (!photoCheck.ok) return NextResponse.json({ error: photoCheck.error }, { status: 400 });
    const uploadedUrl = await saveUploadedFile(file, 'gallery');
    const item = await createGalleryItem({ type, src: uploadedUrl, caption, location, state, city, category });
    return NextResponse.json(item, { status: 201 });
  }

  // type === 'video': either a YouTube link OR an uploaded video file is required.
  if (!youtubeUrl && !hasFile) {
    return NextResponse.json(
      { error: 'Provide a YouTube link or upload a video file' },
      { status: 400 }
    );
  }
  if (youtubeUrl && !isYouTubeUrl(youtubeUrl)) {
    return NextResponse.json({ error: "That doesn't look like a valid YouTube link" }, { status: 400 });
  }
  if (!youtubeUrl && !hasThumbFile) {
    return NextResponse.json(
      { error: 'A thumbnail image is required when uploading a video file' },
      { status: 400 }
    );
  }

  if (!youtubeUrl) {
    const videoCheck = await checkMediaFile(file, ['video']);
    if (!videoCheck.ok) return NextResponse.json({ error: videoCheck.error }, { status: 400 });
  }
  if (hasThumbFile) {
    const thumbCheck = await checkMediaFile(thumbnailFile, ['image']);
    if (!thumbCheck.ok) return NextResponse.json({ error: `Thumbnail: ${thumbCheck.error}` }, { status: 400 });
  }

  const videoUrl = youtubeUrl || (await saveUploadedFile(file, 'gallery'));
  const thumbUrl = hasThumbFile
    ? await saveUploadedFile(thumbnailFile, 'gallery')
    : getYouTubeThumbnail(youtubeUrl);

  const item = await createGalleryItem({
    type,
    videoUrl,
    thumb: thumbUrl,
    title: caption,
    duration: '',
    category: category || 'Video',
  });

  return NextResponse.json(item, { status: 201 });
}
