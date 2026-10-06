import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: String,
    content: String,
    date: String,
    category: String,
    state: String,
    city: String,
    image: String,
    author: String,
  },
  { strict: false, timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
