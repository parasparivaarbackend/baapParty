import PageHeader from '@/components/PageHeader';
import DonateForm from '@/components/DonateForm';
import { FileCheck2, ShieldCheck, TrendingUp } from 'lucide-react';

export const metadata = {
  title: "Contribution — Bharatiya Avijit Aawaz Party",
};

const trust = [
  { icon: ShieldCheck, title: 'Fully Compliant', text: 'Every contribution follows Election Commission funding limits and KYC norms.' },
  { icon: FileCheck2, title: 'Public Ledger', text: 'Contributions above ₹2,000 are logged with a receipt number on our transparency page.' },
  { icon: TrendingUp, title: 'Where It Goes', text: 'Funds cover booth logistics, printed material, transport and venue costs only.' },
];

export default function DonatePage() {
  return (
    <>
      <PageHeader eyebrow="Support the Sankalp" title="Contribute to the Campaign" crumb="Contribution" />

      <section className="bg-ivory py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-2">
            <span className="section-eyebrow text-xs font-bold uppercase text-saffron">Your Contribution Matters</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-ink">
              Every Rupee Is Tracked, Every Rupee Counts
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              We run a lean campaign funded almost entirely by small individual
              contributions. A ₹500 contribution prints 200 booth pamphlets; ₹5,000
              covers a full day of sound and stage at a village rally.
            </p>

            <div className="mt-8 space-y-5">
              {trust.map((t) => (
                <div key={t.title} className="flex gap-4 rounded-2xl border border-ink/8 bg-white p-5 shadow-card">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-banyan/10 text-banyan">
                    <t.icon size={20} />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold text-ink">{t.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">{t.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <DonateForm />
          </div>
        </div>
      </section>
    </>
  );
}
