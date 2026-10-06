import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { getPublicStats } from '@/lib/db/grievances';
import { STATUSES } from '@/lib/grievanceConfig';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Resolution Tracker — Youth & Women Wing Help Desk' };

const WING_LABEL = { youth: 'Youth Wing', women: 'Women Wing', general: 'General' };
const BAR = { Resolved: 'bg-banyan', Pending: 'bg-marigold', Submitted: 'bg-saffron', Verified: 'bg-chakra', Referred: 'bg-ink-soft', 'Follow-up': 'bg-saffron-light' };

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-card">
      <p className="font-display text-3xl font-extrabold text-ink">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-ink-soft">{label}</p>
      {sub && <p className="mt-1 text-[11px] text-ink-soft/70">{sub}</p>}
    </div>
  );
}

function Rows({ rows }) {
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.name}>
          <div className="flex justify-between text-sm"><span className="font-semibold text-ink">{r.name}</span><span className="text-ink-soft">{r.resolved} / {r.total} resolved</span></div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/8"><div className="h-full rounded-full bg-banyan" style={{ width: `${r.total ? Math.round((r.resolved / r.total) * 100) : 0}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}

export default async function ResolutionTrackerPage() {
  let s = null;
  try { s = await getPublicStats(); } catch (err) { console.error('stats failed', err); }

  return (
    <>
      <PageHeader eyebrow="Transparency" title="Resolution Tracker" crumb="Resolution Tracker" />
      <section className="bg-ivory py-16">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          {!s || s.total === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-ink/10 bg-white/60 p-10 text-center text-sm text-ink-soft">
              {s ? 'No problems have been reported yet. Numbers will appear here as the help desk gets used.' : 'Numbers are not available right now. Please try again later.'}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Stat label="Problems received" value={s.total} />
                <Stat label="Resolved" value={s.resolved} sub={`${s.open} still open`} />
                <Stat label="Resolution rate" value={`${s.resolutionRate}%`} />
                <Stat label="Avg. days to resolve" value={s.avgDaysToResolve ?? '—'} sub={s.avgDaysToResolve == null ? 'No resolved case yet' : 'Resolved cases only'} />
              </div>

              <div className="mt-10 rounded-3xl bg-white p-6 shadow-card sm:p-8">
                <h2 className="font-display text-lg font-extrabold text-ink">Where tickets stand</h2>
                <div className="mt-4 flex h-4 overflow-hidden rounded-full bg-ink/8">
                  {STATUSES.filter((k) => s.byStatus[k]).map((k) => (
                    <div key={k} title={`${k}: ${s.byStatus[k]}`} className={BAR[k]} style={{ width: `${(s.byStatus[k] / s.total) * 100}%` }} />
                  ))}
                </div>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
                  {STATUSES.filter((k) => s.byStatus[k]).map((k) => (
                    <li key={k} className="flex items-center gap-2"><span className={`h-3 w-3 rounded-full ${BAR[k]}`} /> {k}: <b className="text-ink">{s.byStatus[k]}</b></li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-2">
                <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
                  <h2 className="mb-5 font-display text-lg font-extrabold text-ink">By wing</h2>
                  <Rows rows={Object.entries(s.byWing).filter(([, v]) => v.total).map(([k, v]) => ({ name: WING_LABEL[k], ...v }))} />
                </div>
                {s.states.length > 0 && (
                  <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
                    <h2 className="mb-5 font-display text-lg font-extrabold text-ink">Top states</h2>
                    <Rows rows={s.states} />
                  </div>
                )}
                {s.districts.length > 0 && (
                  <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8 lg:col-span-2">
                    <h2 className="mb-5 font-display text-lg font-extrabold text-ink">Top districts</h2>
                    <Rows rows={s.districts} />
                  </div>
                )}
              </div>

              <p className="mt-8 text-center text-xs leading-relaxed text-ink-soft/80">
                These figures come from tickets filed on this website and are updated every few minutes. Confidential cases are
                counted in the totals only. Places with fewer than {s.minGroup} tickets are not listed, to protect privacy.
                “Resolved” means our team marked the ticket resolved — it does not guarantee a particular outcome.
              </p>
            </>
          )}
          <div className="mt-10 text-center">
            <Link href="/report-problem" className="inline-block rounded-full bg-saffron px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-card hover:bg-saffron-dark">अपनी समस्या दर्ज करें</Link>
          </div>
        </div>
      </section>
    </>
  );
}
