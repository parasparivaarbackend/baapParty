import mongoose from 'mongoose';

// One live code per email + purpose. MongoDB deletes the document itself once
// `expiresAt` passes (TTL index), so codes never pile up.
const OtpCodeSchema = new mongoose.Schema({
  key: { type: String, required: true }, // the verified address (email today; could be a phone later)
  purpose: { type: String, enum: ['file', 'track'], required: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  lastSentAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});
OtpCodeSchema.index({ key: 1, purpose: 1 }, { unique: true });

export default mongoose.models.OtpCode || mongoose.model('OtpCode', OtpCodeSchema);
