'use client';

import { useMemo, useState } from 'react';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';

// Lucide has no X (Twitter) logo, so it is drawn here.
function XIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

function TeamCard({ m }) {
  const socials = [
    { key: 'facebook', label: 'Facebook', url: m.facebook, icon: <Facebook size={20} /> },
    { key: 'instagram', label: 'Instagram', url: m.instagram, icon: <Instagram size={20} /> },
    { key: 'twitter', label: 'X', url: m.twitter, icon: <XIcon /> },
  ].filter((x) => x.url);

  return (
    <div className="flex flex-col items-center rounded-2xl border border-ink/8 bg-white p-6 text-center shadow-card">
      {m.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.photo} alt={m.name} loading="lazy" className="h-36 w-36 rounded-full bg-chakra object-cover object-top" />
      ) : (
        <div className="flex h-36 w-36 items-center justify-center rounded-full bg-chakra font-display text-4xl font-extrabold text-white" aria-hidden="true">
          {initials(m.name)}
        </div>
      )}
      <p className="mt-5 font-display text-lg font-bold text-ink">{m.name}</p>
      <p className="text-sm font-semibold text-saffron-dark">{m.designation}</p>
      {(m.phone || m.email) && (
        <div className="mt-3 space-y-1 text-sm text-ink-soft">
          {m.phone && <a href={`tel:+91${m.phone}`} className="flex items-center justify-center gap-2 hover:text-saffron"><Phone size={14} /> {m.phone}</a>}
          {m.email && <a href={`mailto:${m.email}`} className="flex items-center justify-center gap-2 break-all hover:text-saffron"><Mail size={14} /> {m.email}</a>}
        </div>
      )}
      {socials.length > 0 && (
        <div className="mt-4 flex items-center justify-center gap-5 text-ink">
          {socials.map((x) => (
            <a key={x.key} href={x.url} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on ${x.label}`} className="transition-colors hover:text-saffron">
              {x.icon}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

const field = 'rounded-xl border-2 border-ink/10 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-saffron';

export default function TeamsView({ members }) {
  const [state, setState] = useState('');
  const [q, setQ] = useState('');

  const states = useMemo(() => [...new Set(members.map((m) => m.state))].sort(), [members]);
  const groups = useMemo(() => {
    const s = q.trim().toLowerCase();
    const map = new Map();
    members
      .filter((m) => (!state || m.state === state) && (!s || `${m.district} ${m.name}`.toLowerCase().includes(s)))
      .forEach((m) => {
        const key = `${m.district}, ${m.state}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(m);
      });
    return [...map.entries()];
  }, [members, state, q]);

  if (members.length === 0) {
    return <p className="rounded-2xl border-2 border-dashed border-ink/10 bg-white/60 p-10 text-center text-sm text-ink-soft">District teams are being formed. Please check back soon.</p>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-3">
        <select value={state} onChange={(e) => setState(e.target.value)} className={field}>
          <option value="">All states</option>
          {states.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search district or name" className={`${field} min-w-[220px]`} />
      </div>
      {groups.length === 0 ? (
        <p className="text-sm text-ink-soft">No team found for this search.</p>
      ) : (
        <div className="space-y-8">
          {groups.map(([place, list]) => (
            <div key={place}>
              <h3 className="mb-3 font-display text-lg font-extrabold text-ink">{place}</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((m) => <TeamCard key={m.id} m={m} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
