import { connectDB } from '@/lib/db/mongoose';
import NotificationLog from '@/models/NotificationLog';
import { sendSms, sendWhatsApp, sendEmail, maskPhone, smsEnabled, whatsappEnabled } from './providers';
import { ticketCreatedEmail, ticketUpdateEmail } from './emailTemplate';

const siteUrl = () => (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
const firstName = (name) => String(name || '').trim().split(/\s+/)[0].slice(0, 30);

/**
 * Sends the citizen the updates they opted into (email today; SMS/WhatsApp when switched on) and records each attempt.
 * Never throws — a failed message must not fail filing or updating a ticket.
 *
 * Privacy rules: the problem text is never sent anywhere. For confidential cases
 * only the ticket number and status go out (no category, place or public note),
 * and only on channels the citizen explicitly chose.
 *
 * @param g      full grievance document (plain object)
 * @param event  'created' | 'update'
 * @param opts   { publicMessage, statusChanged }  officer's public note for the e-mail body
 *               (non-confidential only); statusChanged=false means a message-only update
 */
export async function notifyCitizen(g, event, { publicMessage, statusChanged = true } = {}) {
  const jobs = [];
  const n = g.notify || {};
  const track = `${siteUrl()}/track`;
  const sensitive = !!g.isSensitive;
  const id = String(g._id || g.id);

  if (n.sms && g.contactPhone && smsEnabled()) {
    jobs.push(['sms', maskPhone(g.contactPhone), () =>
      event === 'created'
        ? sendSms(g.contactPhone, 'MSG91_TEMPLATE_CREATED', [g.ticketId, track])
        : sendSms(g.contactPhone, 'MSG91_TEMPLATE_UPDATE', [g.ticketId, g.status])]);
  }
  if (n.whatsapp && g.contactPhone && whatsappEnabled()) {
    jobs.push(['whatsapp', maskPhone(g.contactPhone), () =>
      event === 'created'
        ? sendWhatsApp(g.contactPhone, 'WHATSAPP_TEMPLATE_CREATED', [g.ticketId, track])
        : sendWhatsApp(g.contactPhone, 'WHATSAPP_TEMPLATE_UPDATE', [g.ticketId, g.status])]);
  }
  if (n.email && g.email) {
    // Confidential cases: only the ticket number and status go out (no name, no public note).
    const mail = event === 'created'
      ? ticketCreatedEmail({ ticketId: g.ticketId, trackUrl: track, name: sensitive ? '' : firstName(g.name), siteUrl: siteUrl() })
      : ticketUpdateEmail({ ticketId: g.ticketId, status: g.status, statusChanged, message: sensitive ? '' : publicMessage, sensitive, trackUrl: track, siteUrl: siteUrl() });
    jobs.push(['email', g.email.replace(/^(.).*(@.*)$/, '$1***$2'), () => sendEmail(g.email, mail.subject, mail.text, mail.html)]);
  }
  if (!jobs.length) return [];

  const results = await Promise.all(
    jobs.map(async ([channel, to, run]) => {
      try {
        const r = await run();
        return { channel, to, status: r.status, detail: r.detail };
      } catch (err) {
        console.error(`notify ${channel} failed for ${g.ticketId}:`, err.message);
        return { channel, to, status: 'failed', detail: String(err.message).slice(0, 200) };
      }
    })
  );

  try {
    await connectDB();
    await NotificationLog.insertMany(results.map((r) => ({ grievanceId: id, ticketId: g.ticketId, event, ...r })));
  } catch (err) {
    console.error('notification log failed:', err.message);
  }
  return results;
}

export async function notificationLogs(grievanceId) {
  await connectDB();
  const list = await NotificationLog.find({ grievanceId: String(grievanceId) }).sort({ createdAt: -1 }).limit(20).lean();
  return list.map((l) => ({ channel: l.channel, event: l.event, to: l.to, status: l.status, detail: l.detail || '', at: l.createdAt }));
}
