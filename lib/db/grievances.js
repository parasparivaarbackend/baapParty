import { connectDB, serialize } from './mongoose';
import Grievance from '@/models/Grievance';
import Counter from '@/models/Counter';
import {
  STATE_CODES, WING_PREFIX, districtCode, randomTicketPart, normalizeTicketId,
} from '@/lib/ticket';

async function nextTicketId(data) {
  const prefix = WING_PREFIX[data.wing];
  // Sensitive women's cases get a random, non-guessable ticket number.
  if (data.isSensitive) return `${prefix}-${randomTicketPart(8)}`;
  const series = `${prefix}-${STATE_CODES[data.state] || 'IN'}-${districtCode(data.district)}`;
  const c = await Counter.findOneAndUpdate(
    { _id: series },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `${series}-${String(c.seq).padStart(6, '0')}`;
}

export async function createGrievance(data) {
  await connectDB();
  for (let attempt = 0; attempt < 3; attempt++) {
    const ticketId = await nextTicketId(data);
    try {
      const doc = await Grievance.create({
        ...data,
        ticketId,
        status: 'Submitted',
        timeline: [{ status: 'Submitted', message: 'Your problem has been registered.', by: 'system' }],
      });
      return doc.toObject();
    } catch (err) {
      if (err?.code === 11000) continue; // random-ID collision: try again
      throw err;
    }
  }
  throw new Error('Could not generate a ticket number');
}

/** Admin list. Sensitive cases are masked here; open one to read it in full. */
export async function listGrievances(wings = ['youth', 'women', 'general']) {
  await connectDB();
  const list = await Grievance.find({ wing: { $in: wings } }).sort({ submittedAt: -1 }).limit(1000).lean();
  return serialize(
    list.map((g) =>
      g.isSensitive
        ? { ...g, description: '', contactPhone: '', name: '', email: '', timeline: [] }
        : g
    )
  );
}

export async function getGrievance(id, wings = ['youth', 'women', 'general']) {
  await connectDB();
  try {
    const g = await Grievance.findById(id).lean();
    if (!g || !wings.includes(g.wing)) return null;
    return serialize(g);
  } catch {
    return null;
  }
}

export async function updateGrievance(id, { status, note, message, assignedTo }, adminName = 'admin', wings = ['youth', 'women', 'general']) {
  await connectDB();
  try {
    const g = await Grievance.findById(id);
    if (!g || !wings.includes(g.wing)) return null;
    const changed = status && status !== g.status;
    if (changed) g.status = status;
    if (typeof assignedTo === 'string') g.assignedTo = assignedTo.trim().slice(0, 80);
    if (changed || note || message) {
      g.timeline.push({
        status: g.status,
        note: note ? String(note).slice(0, 1000) : undefined,
        message: message ? String(message).slice(0, 500) : undefined,
        by: adminName,
      });
    }
    await g.save();
    return serialize(g.toObject());
  } catch {
    return null;
  }
}

/** Public tracker: ticket number + the email address used to file it (proven by OTP when enabled). */
export async function trackGrievance(ticketIdRaw, { email } = {}) {
  await connectDB();
  const g = await Grievance.findOne({ ticketId: normalizeTicketId(ticketIdRaw) }).lean();
  if (!g) return null;
  if (!email || String(g.email || '').toLowerCase() !== String(email).toLowerCase()) return null;
  return {
    ticketId: g.ticketId,
    wing: g.wing,
    status: g.status,
    submittedAt: g.submittedAt,
    updatedAt: g.updatedAt,
    isSensitive: !!g.isSensitive,
    // Sensitive cases reveal nothing beyond the status.
    category: g.isSensitive ? 'Confidential' : g.category,
    district: g.isSensitive ? '' : g.district,
    state: g.isSensitive ? '' : g.state,
    timeline: (g.timeline || []).map((t) => ({ status: t.status, at: t.at, message: t.message || '' })),
  };
}

export async function userGrievances(userId) {
  await connectDB();
  const list = await Grievance.find({ userId }).sort({ submittedAt: -1 }).lean();
  return serialize(
    list.map((g) => ({
      ticketId: g.ticketId, wing: g.wing, status: g.status, submittedAt: g.submittedAt,
      category: g.isSensitive ? 'Confidential' : g.category,
      district: g.isSensitive ? '' : g.district, isSensitive: !!g.isSensitive, _id: g._id,
    }))
  );
}

// ---------------------------------------------------------------------------
// Public resolution tracker — aggregate numbers only, never individual cases.
// Confidential (sensitive) cases count towards totals but never appear in any
// location breakdown; places with fewer than MIN_GROUP tickets are not listed,
// so a small number can't point to one person.
// ---------------------------------------------------------------------------
const MIN_GROUP = 5;
let statsCache = { at: 0, data: null };

export async function getPublicStats() {
  if (statsCache.data && Date.now() - statsCache.at < 5 * 60 * 1000) return statsCache.data;
  await connectDB();
  const docs = await Grievance.find({}, 'wing status isSensitive state district submittedAt timeline.status timeline.at').lean();

  const byStatus = {};
  const byWing = { youth: { total: 0, resolved: 0 }, women: { total: 0, resolved: 0 }, general: { total: 0, resolved: 0 } };
  const states = new Map();
  const districts = new Map();
  let resolved = 0;
  let days = 0;
  let timed = 0;

  const bump = (map, key, isResolved) => {
    const row = map.get(key) || { name: key, total: 0, resolved: 0 };
    row.total += 1;
    if (isResolved) row.resolved += 1;
    map.set(key, row);
  };

  for (const g of docs) {
    const isResolved = g.status === 'Resolved';
    byStatus[g.status] = (byStatus[g.status] || 0) + 1;
    if (byWing[g.wing]) {
      byWing[g.wing].total += 1;
      if (isResolved) byWing[g.wing].resolved += 1;
    }
    if (isResolved) {
      resolved += 1;
      const hit = (g.timeline || []).find((t) => t.status === 'Resolved');
      if (hit?.at && g.submittedAt) {
        days += (new Date(hit.at) - new Date(g.submittedAt)) / 86400000;
        timed += 1;
      }
    }
    if (!g.isSensitive) {
      bump(states, g.state, isResolved);
      bump(districts, `${g.district}, ${g.state}`, isResolved);
    }
  }

  const top = (map) =>
    [...map.values()].filter((r) => r.total >= MIN_GROUP).sort((a, b) => b.total - a.total).slice(0, 10);

  const data = {
    total: docs.length,
    resolved,
    open: docs.length - resolved,
    resolutionRate: docs.length ? Math.round((resolved / docs.length) * 100) : 0,
    avgDaysToResolve: timed ? Math.round((days / timed) * 10) / 10 : null,
    byStatus,
    byWing,
    states: top(states),
    districts: top(districts),
    minGroup: MIN_GROUP,
    generatedAt: new Date().toISOString(),
  };
  statsCache = { at: Date.now(), data };
  return data;
}
