import mongoose from 'mongoose';

// One document per person on a district (or state) team of a wing.
const TeamMemberSchema = new mongoose.Schema(
  {
    wing: { type: String, enum: ['youth', 'women'], required: true, index: true },
    state: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true }, // e.g. District President
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    photo: { type: String, trim: true }, // https URL (uploaded via the admin panel)
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    twitter: { type: String, trim: true }, // X (formerly Twitter)
    // Phone / email are shown on the public page only when this is true.
    showContact: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 100 }, // lower = shown first within a district
  },
  { timestamps: true }
);

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
