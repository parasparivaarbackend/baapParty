import { connectDB, serialize } from './mongoose';
import BlogPost from '@/models/BlogPost';
import { blogPosts as seedBlogPosts } from '@/data/content';

async function ensureSeeded() {
  const count = await BlogPost.estimatedDocumentCount();
  if (count === 0 && seedBlogPosts?.length) {
    await BlogPost.insertMany(seedBlogPosts.map((b) => ({ ...b })));
  }
}

export async function getBlogPosts() {
  await connectDB();
  await ensureSeeded();
  const list = await BlogPost.find().lean();
  const sorted = list.sort((a, b) => new Date(b.date) - new Date(a.date));
  return serialize(sorted);
}

export async function getBlogPost(id) {
  await connectDB();
  try {
    const doc = await BlogPost.findById(id).lean();
    return serialize(doc);
  } catch {
    return null;
  }
}

export async function createBlogPost(data) {
  await connectDB();
  const doc = await BlogPost.create(data);
  return serialize(doc.toObject());
}

export async function updateBlogPost(id, data) {
  await connectDB();
  try {
    const doc = await BlogPost.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    return serialize(doc);
  } catch {
    return null;
  }
}

export async function deleteBlogPost(id) {
  await connectDB();
  try {
    const res = await BlogPost.findByIdAndDelete(id);
    return !!res;
  } catch {
    return false;
  }
}
