import Link from 'next/link';
import { getT } from '@/lib/i18n-server';
import { ArrowLeft, UsersRound } from 'lucide-react';

export const metadata = {
  title: "Membership — Bharatiya Avijit Aawaz Party",
};

export default async function MemberPage() {
  const { t } = await getT();
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-ivory px-6 py-24">
      <div className="max-w-lg rounded-3xl border border-ink/8 bg-white p-10 text-center shadow-card">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-banyan/10 text-banyan">
          <UsersRound size={30} />
        </span>
        <span className="section-eyebrow mt-6 block text-xs font-bold uppercase text-banyan">{t("Membership")}</span>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-ink">{t("Coming Soon")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {t("Party membership is opening shortly. Until then, you can already join the movement as a volunteer.")}
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/volunteer"
            className="rounded-full bg-saffron px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-colors hover:bg-saffron-dark"
          >
            {t("Join as Volunteer")}
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink/15 px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink"
          >
            <ArrowLeft size={16} /> {t("Home")}
          </Link>
        </div>
      </div>
    </section>
  );
}
