import { connectDB, serialize } from './mongoose';
import GalleryItem from '@/models/GalleryItem';


export async function getGalleryItems() {
  await connectDB();
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
