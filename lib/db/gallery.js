import { connectDB, serialize } from './mongoose';
import GalleryItem from '@/models/GalleryItem';
import { galleryPhotos, galleryVideos } from '@/data/content';

async function ensureSeeded() {
  const count = await GalleryItem.estimatedDocumentCount();
  if (count > 0) return;

  const seedDocs = [
    ...galleryPhotos.map((p) => ({
      type: 'photo',
      src: p.src,
      caption: p.caption,
      location: p.location,
      category: p.category,
    })),
    ...galleryVideos.map((v) => ({
      type: 'video',
      title: v.title,
      duration: v.duration,
      thumb: v.thumb,
      videoUrl: null,
      category: 'Video',
    })),
  ];
  if (seedDocs.length) await GalleryItem.insertMany(seedDocs);
}

export async function getGalleryItems() {
  await connectDB();
  await ensureSeeded();
  const list = await GalleryItem.find().lean();
  const sorted = list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return serialize(sorted);
}

export async function createGalleryItem(data) {
  await connectDB();
  const doc = await GalleryItem.create(data);
  return serialize(doc.toObject());
}

export async function deleteGalleryItem(id) {
  await connectDB();
  try {
    const res = await GalleryItem.findByIdAndDelete(id);
    return !!res;
  } catch {
    return false;
  }
}
