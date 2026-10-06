import Link from 'next/link';
import { ArrowRight, CheckCircle2, Lock, PhoneCall } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { sectionHref } from '@/data/wings';

export default function WingSectionPage({ wing, section }) {
  const isWomen = wing.slug === 'women';
  const btn = isWomen ? 'bg-banyan text-white hover:bg-banyan-dark' : 'bg-saffron text-white hover:bg-saffron-dark';
  const reportHref = `/report-problem?wing=${wing.slug}${section.category ? `&category=${encodeURIComponent(section.category)}` : ''}`;
  const others = wing.sections.filter((s) => s.slug !== section.slug && s.points);

  return (
    <>
      <PageHeader eyebrow={wing.name} title={section.title} crumb={section.title} />

      <section className="bg-ivory py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <p className="text-lg leading-relaxed text-ink-soft">{section.desc}</p>

          {section.emergency && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-chakra/20 bg-chakra/5 p-5 text-sm text-ink">
              <PhoneCall size={20} className="mt-0.5 shrink-0 text-chakra" />
              <p>In immediate danger? Call <b>112</b>. Women Helpline: <b>181</b>. Cyber crime: <b>1930</b>. This website is not an emergency service.</p>
            </div>
          )}
          {section.legalNote && (
            <p className="mt-6 rounded-2xl border border-marigold/40 bg-marigold/10 p-5 text-sm text-ink">
              This is general information and referral help. It is not legal advice and does not create a lawyer–client relationship.
            </p>
          )}
          {section.note && <p className="mt-6 rounded-2xl border border-ink/10 bg-white p-5 text-sm text-ink-soft">{section.note}</p>}

          <h2 className="mt-10 font-display text-2xl font-extrabold text-ink">What you can ask us for</h2>
          <ul className="mt-5 space-y-3">
            {section.points.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-card">
                <CheckCircle2 size={20} className={`mt-0.5 shrink-0 ${isWomen ? 'text-banyan' : 'text-saffron'}`} />
                <span className="text-sm text-ink">{p}</span>
              </li>
            ))}
          </ul>

          {isWomen && (
            <p className="mt-6 flex items-start gap-2 text-sm text-ink-soft">
              <Lock size={16} className="mt-0.5 shrink-0 text-banyan" />
              Sensitive matter? Choose the confidential option in the form — it stays off the public tracker.
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={reportHref} className={`rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wide shadow-card transition-colors ${btn}`}>
              अपनी समस्या दर्ज करें
            </Link>
            {section.links?.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-full border-2 border-ink/15 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink hover:border-ink">
                {l.label}
              </Link>
            ))}
            <Link href={`/${wing.slug}/teams`} className="rounded-full border-2 border-ink/15 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink hover:border-ink">
              District Teams
            </Link>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="bg-paper py-14">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="font-display text-xl font-extrabold text-ink">More from the {wing.name}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {others.map((s) => (
                <li key={s.slug}>
                  <Link href={sectionHref(wing, s)} className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-sm font-bold text-ink shadow-card transition-colors hover:text-saffron">
                    {s.title} <ArrowRight size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
