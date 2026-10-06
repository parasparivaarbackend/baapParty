import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    // super = full access; officers only see grievances of their wing(s);
    // content_manager can only manage Events, Blog / Press and Gallery.
    // Older admin accounts have no role and are treated as 'super'.
    role: { type: String, enum: ['super', 'youth_officer', 'women_officer', 'content_manager'], default: 'super' },
  },
  { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
