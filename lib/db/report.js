import * as XLSX from 'xlsx';
import { connectDB } from './mongoose';
import Grievance from '@/models/Grievance';

const IST = 'Asia/Kolkata';
const fmtDT = (d) => (d ? new Date(d).toLocaleString('en-IN', { timeZone: IST, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');

// Spreadsheet apps run text starting with = + - @ as a formula. District and other
// fields are typed by the public, so neutralise them before they reach a cell.
const safe = (v) => (typeof v === 'string' && /^[=+\-@\t\r]/.test(v) ? `'${v}` : v);

export const monthBounds = (month) => {
  const start = new Date(`${month}-01T00:00:00+05:30`);
  const [y, m] = month.split('-').map(Number);
  const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
  return { start, end: new Date(`${next}-01T00:00:00+05:30`) };
};

const sheet = (rows, widths) => {
  const ws = XLSX.utils.aoa_to_sheet(rows.map((r) => r.map(safe)));
  ws['!cols'] = widths.map((wch) => ({ wch }));
  return ws;
};

const resolvedAtOf = (g) => (g.timeline || []).find((t) => t.status === 'Resolved')?.at || null;

/**
 * Monthly report as an .xlsx buffer. Confidential cases are counted in the summary
 * and by-wing sheets only — they never appear in the ticket list, place or category
 * sheets, and no description or phone number is ever exported.
 */
export async function buildMonthlyReport({ month, wings }) {
  await connectDB();
  const { start, end } = monthBounds(month);
  const all = await Grievance.find({ wing: { $in: wings } }, 'ticketId wing category isSensitive state district status assignedTo submittedAt timeline.status timeline.at').lean();

  const received = all.filter((g) => g.submittedAt >= start && g.submittedAt < end);
  const resolvedInMonth = all.filter((g) => {
    const at = resolvedAtOf(g);
    return at && new Date(at) >= start && new Date(at) < end;
  });
  const openNow = all.filter((g) => g.status !== 'Resolved');
  const daysList = resolvedInMonth.map((g) => (new Date(resolvedAtOf(g)) - g.submittedAt) / 86400000);
  const avgDays = daysList.length ? Math.round((daysList.reduce((a, b) => a + b, 0) / daysList.length) * 10) / 10 : null;
  const resolvedOfReceived = received.filter((g) => g.status === 'Resolved').length;
  const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : '—');

  const tally = (list, keyFn) => {
    const map = new Map();
    for (const g of list) {
      const k = keyFn(g);
      const row = map.get(k.join('\u0000')) || { k, total: 0, resolved: 0 };
      row.total += 1;
      if (g.status === 'Resolved') row.resolved += 1;
      map.set(k.join('\u0000'), row);
    }
    return [...map.values()].sort((a, b) => b.total - a.total || a.k.join().localeCompare(b.k.join()));
  };
  const openOf = (r) => r.total - r.resolved;
  const named = received.filter((g) => !g.isSensitive);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet([
    ['Grievance report', month],
    ['Wings included', wings.join(', ')],
    ['Generated (IST)', fmtDT(new Date())],
    [],
    ['Metric', 'Value'],
    ['Problems received this month', received.length],
    ['…of which confidential (counted here only)', received.filter((g) => g.isSensitive).length],
    ['Received this month and resolved so far', `${resolvedOfReceived} (${pct(resolvedOfReceived, received.length)})`],
    ['Tickets resolved this month (any filing month)', resolvedInMonth.length],
    ['Average days to resolve (tickets resolved this month)', avgDays ?? '—'],
    ['Open tickets right now (all months)', openNow.length],
  ], [52, 30]), 'Summary');

  XLSX.utils.book_append_sheet(wb, sheet([
    ['Wing', 'Received', 'Resolved so far', 'Still open'],
    ...tally(received, (g) => [g.wing]).map((r) => [r.k[0], r.total, r.resolved, openOf(r)]),
  ], [16, 12, 16, 12]), 'By Wing');

  XLSX.utils.book_append_sheet(wb, sheet([
    ['Status', 'Tickets received this month'],
    ...tally(received, (g) => [g.status]).map((r) => [r.k[0], r.total]),
  ], [18, 28]), 'By Status');

  XLSX.utils.book_append_sheet(wb, sheet([
    ['State', 'Received', 'Resolved so far', 'Still open'],
    ...tally(named, (g) => [g.state]).map((r) => [r.k[0], r.total, r.resolved, openOf(r)]),
  ], [34, 12, 16, 12]), 'By State');

  XLSX.utils.book_append_sheet(wb, sheet([
    ['State', 'District', 'Received', 'Resolved so far', 'Still open'],
    ...tally(named, (g) => [g.state, g.district]).map((r) => [r.k[0], r.k[1], r.total, r.resolved, openOf(r)]),
  ], [34, 26, 12, 16, 12]), 'By District');

  XLSX.utils.book_append_sheet(wb, sheet([
    ['Wing', 'Category', 'Received', 'Resolved so far', 'Still open'],
    ...tally(named, (g) => [g.wing, g.category]).map((r) => [r.k[0], r.k[1], r.total, r.resolved, openOf(r)]),
  ], [14, 38, 12, 16, 12]), 'By Category');

  XLSX.utils.book_append_sheet(wb, sheet([
    ['Ticket', 'Wing', 'Category', 'State', 'District', 'Status', 'Assigned to', 'Submitted (IST)', 'Resolved (IST)', 'Days to resolve'],
    ...named
      .sort((a, b) => a.submittedAt - b.submittedAt)
      .map((g) => {
        const r = resolvedAtOf(g);
        return [g.ticketId, g.wing, g.category, g.state, g.district, g.status, g.assignedTo || '', fmtDT(g.submittedAt), fmtDT(r), r ? Math.round(((new Date(r) - g.submittedAt) / 86400000) * 10) / 10 : ''];
      }),
  ], [22, 10, 34, 24, 22, 12, 18, 22, 22, 14]), 'Tickets');

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}
