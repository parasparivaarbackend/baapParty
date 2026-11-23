import { sendEmail } from './providers';
import { contactReceivedEmail, volunteerReceivedEmail, contributionReceivedEmail } from './emailTemplate';

const siteUrl = () => (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
const first = (rec) => String(rec?.firstName || rec?.name || '').trim().split(/\s+/)[0].slice(0, 30);

/**
 * Confirmation e-mail to the person who just used the Contact, Join Us or Donate form.
 * Like notifyCitizen, it NEVER throws - a mail problem must not make the form fail.
 *
 * @param kind  'contact' | 'volunteer' | 'contribution'
 * @param rec   the saved record (plain object)
 * @returns {Promise<{status: string, detail?: string}>}
 */
export async function notifySubmission(kind, rec) {
  const to = String(rec?.email || '').trim();
  if (!/^\S+@\S+\.\S+$/.test(to)) return { status: 'skipped', detail: 'no email' };
  try {
    const base = { name: first(rec), siteUrl: siteUrl() };
    const mail =
      kind === 'contact' ? contactReceivedEmail({ ...base, type: rec.type, subject: rec.subject })
      : kind === 'volunteer' ? volunteerReceivedEmail({ ...base, phone: rec.phone })
      : contributionReceivedEmail({ ...base, amount: rec.amount });
    return await sendEmail(to, mail.subject, mail.text, mail.html);
  } catch (err) {
    console.error(`submission mail (${kind}) failed:`, err.message);
    return { status: 'failed', detail: String(err.message).slice(0, 200) };
  }
}
