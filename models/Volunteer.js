import mongoose from 'mongoose';

const VolunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    constituency: String,
    userId: { type: String, index: true }, // set when a logged-in member applies
    interests: [String],
    message: String,
    submittedAt: { type: Date, default: Date.now },
  },
  { strict: false }
);

export default mongoose.models.Volunteer || mongoose.model('Volunteer', VolunteerSchema);
