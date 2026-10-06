import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: String,
    type: { type: String, default: 'Query' }, // Query | Complaint | Suggestion
    userId: { type: String, index: true }, // set when a logged-in member sends it
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now },
  },
  { strict: false }
);

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
