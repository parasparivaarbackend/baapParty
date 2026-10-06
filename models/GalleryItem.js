import mongoose from 'mongoose';

const GalleryItemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['photo', 'video'], required: true },
    src: String, // photo URL (Cloudinary)
    caption: String,
    location: String,
    state: String,
    city: String,
    category: String,
    title: String, // video title
    duration: String,
    thumb: String, // video thumbnail
    videoUrl: String, // YouTube link or uploaded video URL (Cloudinary)
  },
  { strict: false, timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

export default mongoose.models.GalleryItem || mongoose.model('GalleryItem', GalleryItemSchema);
