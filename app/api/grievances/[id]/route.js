import { NextResponse } from 'next/server';
import { getGrievance, updateGrievance } from '@/lib/db/grievances';
import { getAdmin, allowedWings } from '@/lib/adminSession';
import { STATUSES } from '@/lib/ticket';
import { notifyCitizen, notificationLogs } from '@/lib/notify';
import { updateNotifyDecision, NO_EMAIL_TEXT } from '@/lib/notify/decide';

// Admin-only. Officers can only open / update grievances of the wings their role covers.
export async function GET(req, { params }) {
  const admin = await getAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const item = await getGrievance(params.id, allowedWings(admin.role));
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ...item, notifications: await notificationLogs(item.id) });
}

export async function PATCH(req, { params }) {
  const admin = await getAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (body.status && !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  const wings = allowedWings(admin.role);
  const before = await getGrievance(params.id, wings);
  const item = await updateGrievance(params.id, body, admin.username, wings);
  if (!before || !item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  // Email the citizen when the status changed or a public message was written, and tell
  // the officer exactly what happened so a missing email is never a mystery.
  const decision = updateNotifyDecision({ before, item, body });
  let notifyOutcome;
  if (!decision.send) {
    notifyOutcome = { state: 'none', text: NO_EMAIL_TEXT[decision.reason] };
  } else {
    const results = await notifyCitizen(item, 'update', { publicMessage: body.message, statusChanged: decision.statusChanged });
    const failed = results.find((r) => r.status === 'failed' || r.status === 'skipped');
    if (!results.length) notifyOutcome = { state: 'none', text: 'No email sent.' };
    else if (failed) notifyOutcome = { state: 'failed', text: `Email could not be sent: ${failed.detail || failed.status}` };
    else if (results.every((r) => r.status === 'simulated')) notifyOutcome = { state: 'sent', text: 'Test mode: SMTP is not configured, so the email was only printed in the server console.' };
    else notifyOutcome = { state: 'sent', text: `Email sent to ${results[0].to}` };
  }
  return NextResponse.json({ ...item, notifications: await notificationLogs(item.id), notifyOutcome });
}
