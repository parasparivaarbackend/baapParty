'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Newspaper, Images, Users, MessageSquare, HandCoins, IndianRupee } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui';

const CARDS = [
  { key: 'events', label: 'Events', href: '/admin/events', icon: CalendarDays, tone: 'saffron' },
  { key: 'blog', label: 'Blog / Press Posts', href: '/admin/blog', icon: Newspaper, tone: 'banyan' },
  { key: 'gallery', label: 'Gallery Items', href: '/admin/gallery', icon: Images, tone: 'ink' },
  { key: 'volunteers', label: 'Volunteer Signups', href: '/admin/volunteers', icon: Users, tone: 'saffron' },
  { key: 'messages', label: 'Unread Messages', href: '/admin/messages', icon: MessageSquare, tone: 'banyan' },
  { key: 'contributions', label: 'Contribution Pledges', href: '/admin/contributions', icon: HandCoins, tone: 'ink' },
];

const toneClasses = {
  saffron: 'bg-saffron/10 text-saffron-dark',
  banyan: 'bg-banyan/10 text-banyan',
  ink: 'bg-ink/8 text-ink',
};

export default function AdminDashboard() {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [events, blog, gallery, volunteers, messages, contributions] = await Promise.all(
          ['events', 'blog', 'gallery', 'volunteers', 'messages', 'contributions'].map((k) =>
            fetch(`/api/${k}`)
              .then((r) => r.json())
              .catch(() => [])
          )
        );
        if (!alive) return;
        setCounts({
          events: events.length,
          blog: blog.length,
          gallery: gallery.length,
          volunteers: volunteers.length,
          messages: messages.filter((m) => !m.read).length,
          contributions: contributions.length,
          totalAmount: contributions.reduce((sum, c) => sum + Number(c.amount || 0), 0),
        });
      } catch {
        if (alive) setCounts({});
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of everything happening on the campaign site." />

      <div className="mb-8 rounded-2xl border border-banyan/20 bg-banyan/5 p-5 text-sm">
        <p className="font-bold text-banyan">Data storage</p>
        <p className="mt-1 text-ink-soft">
          This panel reads and writes MongoDB directly through the functions inside{' '}
          <code className="rounded bg-white/60 px-1.5 py-0.5">lib/db/*.js</code>. Uploaded photos/videos are stored
          on Cloudinary. This panel and its write APIs require an admin login.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(({ key, label, href, icon: Icon, tone }) => (
          <Link
            key={key}
            href={href}
            className="group rounded-2xl border border-ink/8 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
              <Icon size={20} />
            </span>
            <p className="mt-4 text-3xl font-extrabold text-ink">{counts ? counts[key] ?? 0 : '—'}</p>
            <p className="mt-1 text-sm font-semibold text-ink-soft">{label}</p>
          </Link>
        ))}
      </div>

      {counts && (
        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-ink/8 bg-white p-6 shadow-card">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-marigold/15 text-marigold">
            <IndianRupee size={20} />
          </span>
          <div>
            <p className="text-2xl font-extrabold text-ink">₹{(counts.totalAmount || 0).toLocaleString('en-IN')}</p>
            <p className="text-sm font-semibold text-ink-soft">Total pledged contributions</p>
          </div>
        </div>
      )}
    </>
  );
}
