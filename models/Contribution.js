import mongoose from 'mongoose';

const ContributionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    email: String,
    phone: String,
    userId: { type: String, index: true }, // set when a logged-in member contributes
    submittedAt: { type: Date, default: Date.now },
  },
  { strict: false }
);

export default mongoose.models.Contribution || mongoose.model('Contribution', ContributionSchema);
