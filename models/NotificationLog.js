import mongoose from 'mongoose';

// Audit trail of every SMS / WhatsApp / email we tried to send about a ticket.
const NotificationLogSchema = new mongoose.Schema(
  {
    grievanceId: { type: String, index: true },
    ticketId: String,
    event: { type: String, enum: ['created', 'update'] },
    channel: { type: String, enum: ['sms', 'whatsapp', 'email'] },
    to: String, // masked, e.g. ******1234
    status: { type: String, enum: ['sent', 'simulated', 'failed', 'skipped'] },
    detail: String, // error text or skip reason (never message content)
  },
  { timestamps: true }
);
NotificationLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 }); // keep 6 months

export default mongoose.models.NotificationLog || mongoose.model('NotificationLog', NotificationLogSchema);
