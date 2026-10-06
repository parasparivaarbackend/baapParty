import mongoose from 'mongoose';

// `strict: false` lets any extra field the admin form sends (e.g. future
// fields you add without touching the schema) still get saved, matching the
// flexibility the old JSON-file store had.
const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: String,
    location: String,
    state: String,
    city: String,
    category: String,
    mediaType: String,
    image: String,
    videoUrl: String,
    desc: String,
  },
  { strict: false, timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
