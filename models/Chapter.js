import mongoose from 'mongoose';

// One of the "18 Resolution" chapters shown at /manifesto/<slug>.
// content = list of blocks: { type: 'p', text } or { type: 'ul', items: [] } (sub-bullets).
// hi = optional Hindi version of the same fields (edited in Admin -> Chapters).
const BlockSchema = new mongoose.Schema(
  { type: { type: String, enum: ['p', 'ul'], default: 'p' }, text: String, items: [String] },
  { _id: false }
);

const ChapterSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    order: { type: Number, default: 0, index: true },
    title: { type: String, required: true },
    summary: String,
    icon: { type: String, default: 'sparkles' },
    image: String, // cover / share image
    images: [String], // section images, shown zig-zag next to the content
    content: [BlockSchema],
    resolve: String,
    closing: [String],
    published: { type: Boolean, default: true },
    hi: {
      title: String,
      summary: String,
      resolve: String,
      closing: [String],
      content: [BlockSchema],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);
