import { connectDB, serialize } from './mongoose';
import Chapter from '@/models/Chapter';
import { slugify } from '@/lib/chapterUtils';

const withNumbers = (list) => list.map((c, i) => ({ ...c, number: String(i + 1).padStart(2, '0') }));

/** Admin: every chapter, drafts included. Throws if the DB is unreachable. */
export async function getAllChapters() {
  await connectDB();
  const list = await Chapter.find().sort({ order: 1, createdAt: 1 }).lean();
  return withNumbers(serialize(list));
}

/** Public site: published chapters (empty list if the DB is unreachable). */
export async function getPublicChapters() {
  try {
    await connectDB();
      const list = await Chapter.find({ published: { $ne: false } }).sort({ order: 1, createdAt: 1 }).lean();
    return withNumbers(serialize(list));
  } catch (err) {
    console.error('getPublicChapters: could not read chapters', err?.message);
    return [];
  }
}

export async function getChapterById(id) {
  await connectDB();
  try {
    return serialize(await Chapter.findById(id).lean());
  } catch {
    return null;
  }
}

async function uniqueSlug(base, excludeId) {
  let slug = slugify(base) || 'chapter';
  let n = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await Chapter.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    n += 1;
    slug = `${slugify(base) || 'chapter'}-${n}`;
  }
  return slug;
}

function clean(data) {
  const out = {};
  const str = (v) => (typeof v === 'string' ? v.trim() : '');
  const blocks = (arr) =>
    (Array.isArray(arr) ? arr : [])
      .map((b) =>
        b?.type === 'ul'
          ? { type: 'ul', items: (b.items || []).map(str).filter(Boolean) }
          : { type: 'p', text: str(b?.text) }
      )
      .filter((b) => (b.type === 'ul' ? b.items.length : b.text));
  const lines = (arr) => (Array.isArray(arr) ? arr.map(str).filter(Boolean) : []);

  if ('title' in data) out.title = str(data.title);
  if ('summary' in data) out.summary = str(data.summary);
  if ('icon' in data) out.icon = str(data.icon) || 'sparkles';
  if ('image' in data) out.image = str(data.image);
  if ('images' in data) out.images = lines(data.images);
  if ('content' in data) out.content = blocks(data.content);
  if ('resolve' in data) out.resolve = str(data.resolve);
  if ('closing' in data) out.closing = lines(data.closing);
  if ('published' in data) out.published = data.published !== false;
  if (data.order !== '' && data.order != null && Number.isFinite(Number(data.order))) out.order = Number(data.order);
  if (data.hi && typeof data.hi === 'object') {
    out.hi = {
      title: str(data.hi.title),
      summary: str(data.hi.summary),
      resolve: str(data.hi.resolve),
      closing: lines(data.hi.closing),
      content: blocks(data.hi.content),
    };
  }
  return out;
}

export function validateChapter(data, { partial = false } = {}) {
  const c = clean(data);
  if (!partial || 'title' in data) if (!c.title) return { error: 'Title is required' };
  if (!partial || 'content' in data) if (!c.content?.length) return { error: 'Add at least one content point' };
  if (!partial || 'images' in data) if (!c.images?.length) return { error: 'Add at least one image' };
  return { value: c };
}

export async function createChapter(data) {
  await connectDB();
  const { value, error } = validateChapter(data);
  if (error) return { error };
  value.slug = await uniqueSlug(data.slug || value.title);
  if (value.order === undefined) {
    const last = await Chapter.findOne().sort({ order: -1 }).select('order').lean();
    value.order = (last?.order || 0) + 1;
  }
  if (!value.image) value.image = value.images[0];
  const doc = await Chapter.create(value);
  return { item: serialize(doc.toObject()) };
}

export async function updateChapter(id, data) {
  await connectDB();
  const { value, error } = validateChapter(data, { partial: true });
  if (error) return { error };
  try {
    if (data.slug) value.slug = await uniqueSlug(data.slug, id);
    if ('images' in value && !value.image) value.image = value.images[0];
    const doc = await Chapter.findByIdAndUpdate(id, value, { new: true, runValidators: true }).lean();
    return doc ? { item: serialize(doc) } : { notFound: true };
  } catch (err) {
    console.error('updateChapter', err);
    return { notFound: true };
  }
}

export async function deleteChapter(id) {
  await connectDB();
  try {
    return !!(await Chapter.findByIdAndDelete(id));
  } catch {
    return false;
  }
}
