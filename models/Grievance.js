import mongoose from 'mongoose';

const TimelineSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: String, // internal — never sent to the public tracker
    message: String, // public — shown to the citizen on /track
    by: String,
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const GrievanceSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    wing: { type: String, enum: ['youth', 'women', 'general'], required: true, index: true },
    category: { type: String, required: true },
    isSensitive: { type: Boolean, default: false, index: true },
    state: { type: String, required: true },
    district: { type: String, required: true, index: true },
    description: { type: String, required: true },
    attachments: [String],
    name: String,
    contactPhone: String, // optional now: email is the main contact
    email: { type: String, lowercase: true, trim: true, index: true },
    userId: { type: String, index: true },
    status: { type: String, default: 'Submitted', index: true },
    assignedTo: String,
    timeline: [TimelineSchema],
    consent: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false }, // address confirmed by OTP at filing
    // Channels the citizen agreed to receive updates on. Confidential cases default to none.
    notify: {
      sms: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false },
      email: { type: Boolean, default: false },
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Grievance || mongoose.model('Grievance', GrievanceSchema);
