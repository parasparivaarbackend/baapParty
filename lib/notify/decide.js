// Decides whether an admin edit should email the citizen. Pure function (no DB, no I/O)
// so the rules are easy to read and to test.
//
// An email goes out when EITHER the status changed OR the officer wrote a public message
// (not for confidential cases — those never carry the message, the citizen reads it on the
// tracker). Internal notes and "assigned to" changes are never emailed.
export function updateNotifyDecision({ before, item, body }) {
  const statusChanged = item.status !== before.status;
  const hasPublicMessage = String(body?.message || '').trim().length > 0;
  const sensitive = !!item.isSensitive;

  if (!statusChanged && !(hasPublicMessage && !sensitive)) {
    return { send: false, reason: sensitive && hasPublicMessage ? 'confidential-message' : 'no-trigger' };
  }
  if (body?.notify === false) return { send: false, reason: 'unticked' };
  if (!item.email || !item.notify?.email) return { send: false, reason: 'not-opted' };
  return { send: true, statusChanged };
}

export const NO_EMAIL_TEXT = {
  'no-trigger': 'No email sent — the status did not change and there is no public message. Internal notes and assignee changes are never emailed.',
  'confidential-message': 'No email sent — this is a confidential case, so messages are not emailed. The citizen can read your message on the Track page.',
  unticked: 'No email sent — "Notify the citizen" was unticked.',
  'not-opted': 'No email sent — the citizen did not choose email updates for this ticket.',
};
