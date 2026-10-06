import Link from 'next/link';
import {
  Briefcase, CalendarDays, FileText, GraduationCap, HeartPulse, MapPin, MessageSquareWarning,
  PhoneCall, Rocket, Scale, ShieldCheck, Trophy, Users, Lock,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { TICKET_STEPS, sectionHref } from '@/data/wings';

const ICONS = { Briefcase, CalendarDays, FileText, GraduationCap, HeartPulse, MapPin, MessageSquareWarning, Rocket, Scale, ShieldCheck, Trophy, Users };

export default function WingLanding({ wing }) {
  const isWomen = wing.slug === 'women';
  const accent = isWomen ? 'bg-banyan text-white hover:bg-banyan-dark' : 'bg-saffron text-white hover:bg-saffron-dark';
  const accentSoft = isWomen ? 'bg-banyan/10 text-banyan' : 'bg-saffron/10 text-saffron';

  return (
    <>
      <PageHeader eyebrow={wing.hindi} title={wing.name} crumb={wing.name} />

      <section className="bg-ivory pb-8 pt-16">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
            {wing.tagline}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-ink-soft">
            {wing.intro}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={`/report-problem?wing=${wing.slug}`}
              className={`rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wide shadow-card transition-colors ${accent}`}
            >
              {/* अपनी समस्या दर्ज करें */}
              Report Your Problem
            </Link>
            <Link
              href="/volunteer"
              className="rounded-full border-2 border-ink/15 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink hover:border-ink"
            >
              Join as Volunteer
            </Link>
            <Link
              href="/track"
              className="rounded-full border-2 border-ink/15 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink hover:border-ink"
            >
              Track Ticket
            </Link>
          </div>
        </div>
      </section>

      {isWomen && (
        <section className="bg-ivory py-4">
          <div className="mx-auto grid max-w-5xl gap-4 px-6 sm:grid-cols-2 lg:px-8">
            <div className="flex items-start gap-3 rounded-2xl border border-chakra/20 bg-chakra/5 p-5 text-sm text-ink">
              <PhoneCall size={20} className="mt-0.5 shrink-0 text-chakra" />
              <p>
                In immediate danger? Call <b>112</b>. Women Helpline: <b>181</b>
                . Cyber crime: <b>1930</b>. This website is not an emergency
                service.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-banyan/20 bg-banyan/5 p-5 text-sm text-ink">
              <Lock size={20} className="mt-0.5 shrink-0 text-banyan" />
              <p>
                Sensitive matter? Choose <b>“confidential”</b> in the form. It
                stays off the public tracker and gets a private ticket number.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="bg-ivory py-14">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {wing.sections.map((s) => {
              const Icon = ICONS[s.icon] || FileText;
              return (
                <Link
                  key={s.title}
                  href={sectionHref(wing, s)}
                  className="group rounded-2xl border border-ink/8 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${accentSoft}`}
                  >
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-ink group-hover:text-saffron">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {s.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <h2 className="font-display text-2xl font-extrabold text-ink">
            How your ticket moves
          </h2>
          <ol className="mt-8 grid gap-3 sm:grid-cols-5">
            {TICKET_STEPS.map((s, i) => (
              <li key={s} className="rounded-2xl bg-white p-4 shadow-card">
                <span
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${accentSoft}`}
                >
                  {i + 1}
                </span>
                <p className="mt-2 text-sm font-bold text-ink">{s}</p>
              </li>
            ))}
          </ol>
          <Link
            href={`/report-problem?wing=${wing.slug}`}
            className={`mt-10 inline-block rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-wide shadow-card transition-colors ${accent}`}
          >
            {wing.reportLabel}
          </Link>
          <p className="mt-5 text-sm text-ink-soft">
            See how problems are being handled:{" "}
            <Link
              href="/resolution-tracker"
              className="font-bold text-saffron hover:underline"
            >
              Resolution Tracker
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
