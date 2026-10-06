'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, LifeBuoy, Lock, Loader2 } from 'lucide-react';
import { Modal, PageHeader, EmptyState, Badge, Button, inputClass } from '@/components/admin/ui';
import { STATUSES } from '@/lib/grievanceConfig';

const fmt = (d) =>
  new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const tone = (s) => (s === 'Resolved' ? 'banyan' : s === 'Pending' ? 'gray' : s === 'Submitted' ? 'saffron' : 'ink');

export default function AdminGrievancesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [wing, setWing] = useState('');
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(null); // full record
  const [opening, setOpening] = useState(false);
  const [edit, setEdit] = useState({ status: '', assignedTo: '', note: '', message: '', notify: true });
  const [saving, setSaving] = useState(false);
  const [notifyInfo, setNotifyInfo] = useState(null); // { state, text } from the last save
  const [error, setError] = useState('');
  const nowIst = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 7);
  const [reportMonth, setReportMonth] = useState(nowIst);
  const [reportWing, setReportWing] = useState('');

  const load = () =>
    fetch('/api/grievances')
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter(
      (g) =>
        (!wing || g.wing === wing) &&
        (!status || g.status === status) &&
        (!s || `${g.ticketId} ${g.district} ${g.state} ${g.category}`.toLowerCase().includes(s))
    );
  }, [items, q, wing, status]);

  const view = async (g) => {
    setOpening(true); setError('');
    const res = await fetch(`/api/grievances/${g.id}`);
    setOpening(false);
    if (!res.ok) return setError('Could not open this ticket');
    const full = await res.json();
    setOpen(full);
    setNotifyInfo(null);
    setEdit({ status: full.status, assignedTo: full.assignedTo || '', note: '', message: '', notify: true });
  };

  const save = async () => {
    setSaving(true); setError('');
    const res = await fetch(`/api/grievances/${open.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edit),
    });
    setSaving(false);
    if (!res.ok) return setError((await res.json().catch(() => ({}))).error || 'Could not save');
    const updated = await res.json();
    setNotifyInfo(updated.notifyOutcome || null);
    setOpen(updated);
    setEdit({ status: updated.status, assignedTo: updated.assignedTo || '', note: '', message: '', notify: true });
    load();
  };

  return (
    <>
      <PageHeader title="Grievances" subtitle="Problems reported through the Youth / Women Wing help desk" />

      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-card">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-soft">Monthly report</label>
          <input type="month" value={reportMonth} max={nowIst} onChange={(e) => setReportMonth(e.target.value)} className={`${inputClass()} w-auto`} />
        </div>
        <select value={reportWing} onChange={(e) => setReportWing(e.target.value)} className={`${inputClass()} w-auto`}>
          <option value="">All my wings</option><option value="youth">Youth</option><option value="women">Women</option><option value="general">General</option>
        </select>
        <a
          href={reportMonth ? `/api/grievances/report?month=${reportMonth}${reportWing ? `&wing=${reportWing}` : ''}` : undefined}
          className="inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-saffron-dark"
        >
          <Download size={15} /> Download .xlsx
        </a>
        <p className="w-full text-xs text-ink-soft/80">Counts only — no problem text or phone numbers. Confidential cases appear in totals but never in the ticket, place or category sheets.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ticket, district, category…" className={`${inputClass()} max-w-xs`} />
        <select value={wing} onChange={(e) => setWing(e.target.value)} className={`${inputClass()} w-auto`}>
          <option value="">All wings</option><option value="youth">Youth</option><option value="women">Women</option><option value="general">General</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputClass()} w-auto`}>
          <option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-ink-soft">Loading…</p>
      ) : rows.length === 0 ? (
        <EmptyState icon={LifeBuoy} title="No grievances" description="Tickets filed from the website will appear here." />
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-ink/8 text-xs uppercase tracking-wide text-ink-soft">
              <tr><th className="px-4 py-3">Ticket</th><th className="px-4 py-3">Wing</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Place</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Filed</th></tr>
            </thead>
            <tbody>
              {rows.map((g) => (
                <tr key={g.id} onClick={() => view(g)} className="cursor-pointer border-b border-ink/5 hover:bg-paper/60">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-ink">
                    {g.isSensitive && <Lock size={12} className="mr-1 inline text-saffron-dark" />}{g.ticketId}
                  </td>
                  <td className="px-4 py-3 capitalize">{g.wing}</td>
                  <td className="px-4 py-3">{g.category}</td>
                  <td className="px-4 py-3">{g.isSensitive ? '—' : `${g.district}, ${g.state}`}</td>
                  <td className="px-4 py-3"><Badge tone={tone(g.status)}>{g.status}</Badge></td>
                  <td className="px-4 py-3 text-ink-soft">{fmt(g.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {opening && <p className="mt-3 flex items-center gap-2 text-sm text-ink-soft"><Loader2 size={14} className="animate-spin" /> Opening…</p>}
      {error && !open && <p className="mt-3 text-sm font-semibold text-saffron-dark">{error}</p>}

      <Modal open={!!open} onClose={() => setOpen(null)} title={open ? open.ticketId : ''} maxWidth="max-w-2xl">
        {open && (
          <div className="space-y-5 text-sm">
            {open.isSensitive && (
              <p className="flex items-center gap-2 rounded-xl bg-saffron/10 px-4 py-3 font-semibold text-saffron-dark">
                <Lock size={15} /> Sensitive case — handle privately. Do not share details outside the responsible team.
              </p>
            )}
            <div className="grid grid-cols-2 gap-3 text-ink-soft">
              <p><b className="text-ink">Wing:</b> <span className="capitalize">{open.wing}</span></p>
              <p><b className="text-ink">Category:</b> {open.category}</p>
              <p><b className="text-ink">Place:</b> {open.district}, {open.state}</p>
              <p><b className="text-ink">Phone:</b> {open.contactPhone || '—'}</p>
              {open.name && <p><b className="text-ink">Name:</b> {open.name}</p>}
              {open.email && <p><b className="text-ink">Email:</b> {open.email}</p>}
            </div>
            <div>
              <p className="mb-1 font-bold text-ink">Problem</p>
              <p className="whitespace-pre-line rounded-xl bg-ivory p-4 text-ink-soft">{open.description}</p>
            </div>
            {open.attachments?.length > 0 && (
              <div>
                <p className="mb-1 font-bold text-ink">Documents</p>
                <ul className="space-y-1">
                  {open.attachments.map((u, i) => (
                    <li key={u}><a href={u} target="_blank" rel="noopener noreferrer" className="font-semibold text-saffron hover:underline">Document {i + 1}</a></li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3 rounded-2xl border border-ink/10 p-4">
              <p className="font-bold text-ink">Update ticket</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })} className={inputClass()}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <input value={edit.assignedTo} onChange={(e) => setEdit({ ...edit, assignedTo: e.target.value })} placeholder="Assigned to" className={inputClass()} />
              </div>
              <textarea rows={2} value={edit.message} onChange={(e) => setEdit({ ...edit, message: e.target.value })} placeholder="Public message — shown on the Track page and emailed to the citizen (optional)" className={inputClass()} />
              <textarea rows={2} value={edit.note} onChange={(e) => setEdit({ ...edit, note: e.target.value })} placeholder="Internal note — never shown publicly (optional)" className={inputClass()} />
              <label className="flex items-start gap-2 text-xs text-ink-soft">
                <input type="checkbox" checked={edit.notify} onChange={(e) => setEdit({ ...edit, notify: e.target.checked })} className="mt-0.5 accent-saffron" />
                <span>Email the citizen when the status changes or a public message is written (only if they chose email updates{open.isSensitive ? '; confidential case — ticket number and status only, never the message' : ''})</span>
              </label>
              {error && <p className="text-xs font-semibold text-saffron-dark">{error}</p>}
              {notifyInfo && (
                <p className={`rounded-xl px-3 py-2 text-xs font-semibold ${notifyInfo.state === 'sent' ? 'bg-banyan/10 text-banyan' : notifyInfo.state === 'failed' ? 'bg-saffron/10 text-saffron-dark' : 'bg-ink/5 text-ink-soft'}`}>
                  Saved. {notifyInfo.text}
                </p>
              )}
              <Button type="button" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save update'}</Button>
            </div>

            {open.notifications?.length > 0 && (
              <div>
                <p className="mb-2 font-bold text-ink">Messages sent to citizen</p>
                <ul className="space-y-1.5">
                  {open.notifications.map((n, i) => (
                    <li key={i} className="flex flex-wrap items-center gap-2 rounded-xl bg-ivory px-3 py-2 text-xs text-ink-soft">
                      <b className="uppercase text-ink">{n.channel}</b> · {n.event} · {n.to}
                      <Badge tone={n.status === 'failed' ? 'saffron' : n.status === 'sent' ? 'banyan' : 'gray'}>{n.status}</Badge>
                      {n.detail && <span className="text-saffron-dark">{n.detail}</span>}
                      <span className="ml-auto">{fmt(n.at)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="mb-2 font-bold text-ink">History</p>
              <ul className="space-y-2">
                {[...(open.timeline || [])].reverse().map((t, i) => (
                  <li key={i} className="rounded-xl border border-ink/8 p-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wide text-ink-soft"><span>{t.status} · {t.by}</span><span>{fmt(t.at)}</span></div>
                    {t.message && <p className="mt-1 text-ink">Public: {t.message}</p>}
                    {t.note && <p className="mt-1 text-ink-soft">Internal: {t.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
