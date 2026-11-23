import Link from 'next/link';
import { getT } from '@/lib/i18n-server';
import { ArrowRight, CheckCircle2, Lock, PhoneCall } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { sectionHref } from '@/data/wings';

export default async function WingSectionPage({ wing, section }) {
  const { t } = await getT();
  const isWomen = wing.slug === 'women';
  const btn = isWomen ? 'bg-banyan text-white hover:bg-banyan-dark' : 'bg-saffron text-white hover:bg-saffron-dark';
  const reportHref = `/report-problem?wing=${wing.slug}${section.category ? `&category=${encodeURIComponent(section.category)}` : ''}`;
  const others = wing.sections.filter((s) => s.slug !== section.slug && s.points);

  return (
    <>
      <PageHeader eyebrow={t(wing.name)} title={t(section.title)} crumb={t(section.title)} />

      <section className="bg-ivory py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <p className="text-lg leading-relaxed text-ink-soft">{t(section.desc)}</p>

          {section.emergency && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-chakra/20 bg-chakra/5 p-5 text-sm text-ink">
              <PhoneCall size={20} className="mt-0.5 shrink-0 text-chakra" />
              <p>{t('In immediate danger? Call')} <b>112</b>. {t('Women Helpline:')} <b>181</b>. {t('Cyber crime:')} <b>1930</b>. {t('This website is not an emergency service.')}</p>
            </div>
          )}
          {section.legalNote && (
            <p className="mt-6 rounded-2xl border border-marigold/40 bg-marigold/10 p-5 text-sm text-ink">
              {t('This is general information and referral help. It is not legal advice and does not create a lawyer–client relationship.')}
            </p>
          )}
          {section.note && <p className="mt-6 rounded-2xl border border-ink/10 bg-white p-5 text-sm text-ink-soft">{t(section.note)}</p>}

          <h2 className="mt-10 font-display text-2xl font-extrabold text-ink">{t('What you can ask us for')}</h2>
          <ul className="mt-5 space-y-3">
            {section.points.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-card">
                <CheckCircle2 size={20} className={`mt-0.5 shrink-0 ${isWomen ? 'text-banyan' : 'text-saffron'}`} />
                <span className="text-sm text-ink">{t(p)}</span>
              </li>
            ))}
          </ul>

          {isWomen && (
            <p className="mt-6 flex items-start gap-2 text-sm text-ink-soft">
              <Lock size={16} className="mt-0.5 shrink-0 text-banyan" />
              {t('Sensitive matter? Choose the confidential option in the form — it stays off the public tracker.')}
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={reportHref} className={`rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wide shadow-card transition-colors ${btn}`}>
              {t('Report Your Problem')}
            </Link>
            {section.links?.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-full border-2 border-ink/15 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink hover:border-ink">
                {t(l.label)}
              </Link>
            ))}
            <Link href={`/${wing.slug}/teams`} className="rounded-full border-2 border-ink/15 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink hover:border-ink">
              {t('District Teams')}
            </Link>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="bg-paper py-14">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="font-display text-xl font-extrabold text-ink">{t('More from the {name}', { name: t(wing.name) })}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {others.map((s) => (
                <li key={s.slug}>
                  <Link href={sectionHref(wing, s)} className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-sm font-bold text-ink shadow-card transition-colors hover:text-saffron">
                    {t(s.title)} <ArrowRight size={16} />
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
