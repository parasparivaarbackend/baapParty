'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  HandCoins,
  HeartHandshake,
  LayoutDashboard,
  Loader2,
  MessageSquare,
  Pencil,
  LifeBuoy,
  Printer,
  Save,
  User,
  X,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { PARTY } from '@/data/party';
import { useAuth } from '@/context/AuthContext';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'messages', label: 'Complaints & Queries', icon: MessageSquare },
  { id: 'tickets', label: 'My Tickets', icon: LifeBuoy },
  { id: 'contributions', label: 'Contributions', icon: HandCoins },
  { id: 'volunteer', label: 'Volunteer', icon: HeartHandshake },
];

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
const fmtMoney = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function DashboardPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/user/dashboard', { cache: 'no-store' });
      if (res.status === 401) {
        router.replace('/login?from=/dashboard');
        return;
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load');
      setData(json);
      setError('');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <PageHeader eyebrow="Member Area" title="My Dashboard" crumb="Dashboard" />

      <section className="bg-paper py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-32 text-ink-soft">
              <Loader2 className="animate-spin" size={28} />
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-card">
              <p className="font-semibold text-saffron-dark">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  load();
                }}
                className="mt-5 rounded-full bg-saffron px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <p className="mb-6 text-lg font-bold text-ink sm:text-xl">
                Namaste, {data.profile.name.split(' ')[0]} 🙏
              </p>

              {/* Tabs */}
              <div className="-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTab(t.id)}
                      className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                        tab === t.id
                          ? 'bg-saffron text-white shadow-card'
                          : 'bg-white text-ink-soft hover:text-saffron'
                      }`}
                    >
                      <t.icon size={15} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {tab === 'overview' && <Overview data={data} goTo={setTab} />}
              {tab === 'profile' && (
                <Profile
                  profile={data.profile}
                  onSaved={async () => {
                    await Promise.all([load(), refresh()]);
                  }}
                />
              )}
              {tab === 'messages' && <Messages items={data.messages} stats={data.stats} />}
              {tab === 'tickets' && <Tickets items={data.tickets || []} />}
              {tab === 'contributions' && <Contributions items={data.contributions} stats={data.stats} />}
              {tab === 'volunteer' && <Volunteers items={data.volunteers} />}
            </>
          )}
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Overview: membership card + quick stats                             */
/* ------------------------------------------------------------------ */
function Overview({ data, goTo }) {
  const { profile, membership, stats } = data;

  const cards = [
    { label: 'Total Contributed', value: fmtMoney(stats.totalContributed), sub: `${stats.contributionCount} contribution(s)`, tab: 'contributions', icon: HandCoins },
    { label: 'Complaints Raised', value: stats.complaintCount, sub: 'View status', tab: 'messages', icon: MessageSquare },
    { label: 'Queries Sent', value: stats.queryCount, sub: 'View status', tab: 'messages', icon: MessageSquare },
    { label: 'Volunteer Applications', value: stats.volunteerCount, sub: 'View details', tab: 'volunteer', icon: HeartHandshake },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <MembershipCard profile={profile} membership={membership} />
      </div>

      <div className="grid grid-cols-2 content-start gap-4 lg:col-span-2">
        {cards.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => goTo(c.tab)}
            className="rounded-2xl bg-white p-5 text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-saffron/10 text-saffron">
              <c.icon size={17} />
            </span>
            <p className="mt-3 font-display text-2xl font-extrabold text-ink">{c.value}</p>
            <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-ink-soft">{c.label}</p>
            <p className="mt-1 text-[11px] font-semibold text-banyan">{c.sub} →</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function MembershipCard({ profile, membership }) {
  const [qr, setQr] = useState('');

  // QR encodes the membership ID so the card can be verified/scanned at events.
  useEffect(() => {
    let alive = true;
    import('qrcode')
      .then((m) => (m.default || m).toDataURL(membership.id, { margin: 1, width: 240 }))
      .then((url) => alive && setQr(url))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [membership.id]);

  return (
    <div>
      <div
        id="membership-card"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink to-banyan p-6 text-white shadow-card-hover sm:p-8"
      >
        <div className="absolute inset-x-0 top-0 h-1.5 bg-tricolor-thread" />
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-saffron/15 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <Image src="/logo.png" alt={PARTY.fullName} width={52} height={52} className="h-12 w-12 rounded-full bg-white object-cover" />
          <div className="min-w-0 leading-tight">
            <p className="font-display text-lg font-extrabold">{PARTY.shortName}</p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-white/70">{PARTY.fullName}</p>
          </div>
          <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-marigold">
            <BadgeCheck size={13} /> {membership.status}
          </span>
        </div>

        <p className="relative mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-marigold">Member Card</p>

        <div className="relative mt-2 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate font-display text-2xl font-extrabold sm:text-3xl">{profile.name}</h3>
            <p className="mt-1 truncate text-sm text-white/70">{profile.email}</p>

            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
              <div>
                <dt className="font-semibold uppercase tracking-wide text-white/50">Membership ID</dt>
                <dd className="mt-0.5 font-mono text-sm font-bold tracking-wider">{membership.id}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-wide text-white/50">Member Since</dt>
                <dd className="mt-0.5 text-sm font-bold">{fmtDate(membership.since)}</dd>
              </div>
            </dl>
          </div>

          {qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="Membership QR" className="h-24 w-24 shrink-0 rounded-xl bg-white p-1.5 sm:h-28 sm:w-28" />
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.print()}
        className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink"
      >
        <Printer size={15} /> Print / Save as PDF
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Profile (view + edit)                                               */
/* ------------------------------------------------------------------ */
function Profile({ profile, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Could not save');
      await onSaved();
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const rows = [
    ['Full Name', profile.name],
    ['Email', profile.email],
    ['Phone', profile.phone],
    ['City', profile.city],
    ['State', profile.state],
    ['Address', profile.address],
    ['Joined On', fmtDate(profile.joinedAt)],
  ];

  const input =
    'w-full rounded-xl border-2 border-ink/10 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-saffron';

  return (
    <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-extrabold text-ink">My Profile</h2>
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setForm(profile);
              setEditing(true);
            }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:border-saffron hover:text-saffron"
          >
            <Pencil size={14} /> Edit
          </button>
        )}
      </div>

      {saved && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-banyan/10 px-4 py-2.5 text-sm font-semibold text-banyan">
          <CheckCircle2 size={16} /> Profile updated.
        </p>
      )}

      {!editing ? (
        <dl className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div key={k} className="border-b border-ink/8 pb-3">
              <dt className="text-[11px] font-bold uppercase tracking-wide text-ink-soft/70">{k}</dt>
              <dd className="mt-1 break-words text-sm font-semibold text-ink">{v || '—'}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <form onSubmit={save} className="mt-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Full Name">
              <input className={input} value={form.name} onChange={set('name')} required />
            </Field>
            <Field label="Email (cannot be changed)">
              <input className={`${input} cursor-not-allowed opacity-60`} value={form.email} disabled />
            </Field>
            <Field label="Phone">
              <input className={input} value={form.phone} onChange={set('phone')} type="tel" />
            </Field>
            <Field label="City">
              <input className={input} value={form.city} onChange={set('city')} />
            </Field>
            <Field label="State">
              <input className={input} value={form.state} onChange={set('state')} />
            </Field>
            <Field label="Address">
              <input className={input} value={form.address} onChange={set('address')} />
            </Field>
          </div>

          {error && <p className="mt-4 text-sm font-semibold text-saffron-dark">{error}</p>}

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-banyan px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-banyan-dark disabled:opacity-60"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink"
            >
              <X size={15} /> Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Lists                                                               */
/* ------------------------------------------------------------------ */
function Panel({ title, summary, action, children }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-extrabold text-ink">{title}</h2>
          {summary && <p className="mt-1 text-sm text-ink-soft">{summary}</p>}
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Empty({ text, href, cta }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-ink/10 py-12 text-center">
      <p className="text-sm text-ink-soft">{text}</p>
      <Link href={href} className="mt-4 inline-block rounded-full bg-saffron px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-saffron-dark">
        {cta}
      </Link>
    </div>
  );
}

function ActionLink({ href, children }) {
  return (
    <Link href={href} className="rounded-full bg-saffron px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-saffron-dark">
      {children}
    </Link>
  );
}

function Messages({ items, stats }) {
  const badge = {
    complaint: 'bg-saffron/10 text-saffron-dark',
    query: 'bg-chakra/10 text-chakra',
    suggestion: 'bg-banyan/10 text-banyan',
  };

  return (
    <Panel
      title="Complaints & Queries"
      summary={`${stats.complaintCount} complaint(s) · ${stats.queryCount} other message(s)`}
      action={<ActionLink href="/contact">Raise New</ActionLink>}
    >
      {items.length === 0 ? (
        <Empty text="You haven't sent any complaint or query yet." href="/contact" cta="Contact Us" />
      ) : (
        <ul className="space-y-4">
          {items.map((m) => {
            const type = (m.type || 'Query').toLowerCase();
            return (
              <li key={m.id} className="rounded-2xl border border-ink/8 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${badge[type] || badge.query}`}>
                    {m.type || 'Query'}
                  </span>
                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                      m.read ? 'bg-banyan/10 text-banyan' : 'bg-marigold/20 text-ink-soft'
                    }`}
                  >
                    {m.read ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {m.read ? 'Seen by team' : 'Pending'}
                  </span>
                  <span className="ml-auto text-xs font-semibold text-ink-soft/70">{fmtDate(m.submittedAt)}</span>
                </div>
                {m.subject && <h3 className="mt-3 font-display text-base font-bold text-ink">{m.subject}</h3>}
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">{m.message}</p>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

function Tickets({ items }) {
  return (
    <Panel
      title="My Tickets"
      summary={`${items.length} problem(s) reported through the Youth / Women Wing help desk`}
      action={<ActionLink href="/report-problem">Report a Problem</ActionLink>}
    >
      {items.length === 0 ? (
        <Empty text="You haven't reported any problem while logged in." href="/report-problem" cta="Report Your Problem" />
      ) : (
        <ul className="space-y-4">
          {items.map((t) => (
            <li key={t.id} className="rounded-2xl border border-ink/8 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold tracking-wider text-ink">{t.ticketId}</span>
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${t.status === 'Resolved' ? 'bg-banyan/10 text-banyan' : 'bg-saffron/10 text-saffron-dark'}`}>
                  {t.status}
                </span>
                <span className="ml-auto text-xs font-semibold text-ink-soft/70">{fmtDate(t.submittedAt)}</span>
              </div>
              <p className="mt-2 text-sm text-ink-soft">{t.category}{t.district ? ` · ${t.district}` : ''}</p>
              <Link href="/track" className="mt-2 inline-block text-xs font-bold uppercase tracking-wide text-saffron hover:underline">
                Full status →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function Contributions({ items, stats }) {
  return (
    <Panel
      title="My Contributions"
      summary={`Total contributed: ${fmtMoney(stats.totalContributed)} across ${stats.contributionCount} contribution(s)`}
      action={<ActionLink href="/donate">Contribute</ActionLink>}
    >
      {items.length === 0 ? (
        <Empty text="You haven't made any contribution yet." href="/donate" cta="Contribute Now" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-[11px] font-bold uppercase tracking-wide text-ink-soft/70">
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Amount</th>
                <th className="py-3">Method</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b border-ink/5 last:border-none">
                  <td className="py-3 pr-4 font-semibold text-ink-soft">{fmtDate(c.submittedAt)}</td>
                  <td className="py-3 pr-4 font-bold text-banyan">{fmtMoney(c.amount)}</td>
                  <td className="py-3 font-semibold uppercase text-ink-soft">{c.method || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function Volunteers({ items }) {
  return (
    <Panel
      title="Volunteer Applications"
      summary={items.length ? `${items.length} application(s) submitted` : undefined}
      action={<ActionLink href="/volunteer">Join as Volunteer</ActionLink>}
    >
      {items.length === 0 ? (
        <Empty text="You haven't applied as a volunteer yet." href="/volunteer" cta="Volunteer Form" />
      ) : (
        <ul className="space-y-4">
          {items.map((v) => (
            <li key={v.id} className="rounded-2xl border border-ink/8 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-base font-bold text-ink">{v.constituency || 'Constituency not specified'}</p>
                <span className="text-xs font-semibold text-ink-soft/70">{fmtDate(v.submittedAt)}</span>
              </div>
              {v.interests?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {v.interests.map((i) => (
                    <span key={i} className="rounded-full bg-banyan/10 px-3 py-1 text-[11px] font-bold text-banyan">
                      {i}
                    </span>
                  ))}
                </div>
              )}
              {v.message && <p className="mt-3 text-sm leading-relaxed text-ink-soft">{v.message}</p>}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
