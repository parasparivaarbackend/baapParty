import mongoose from 'mongoose';

const VolunteerSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    name: { type: String, required: true }, // = first + last (kept for older records and exports)
    phone: { type: String, required: true },
    email: { type: String, required: true },
    constituency: String,
    userId: { type: String, index: true }, // set when a logged-in member applies
    interests: [String],
    message: String,
    // 18+ declaration + age/ID proof. The file itself is stored privately (see lib/upload.js saveSecureFile).
    isAdult: { type: Boolean, default: false },
    idProofType: String, // e.g. 'Voter ID (EPIC)', 'Aadhaar'
    idProof: {
      publicId: String,
      resourceType: String,
      format: String,
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { strict: false }
);

export default mongoose.models.Volunteer || mongoose.model('Volunteer', VolunteerSchema);
