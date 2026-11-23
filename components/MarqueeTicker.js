import { getT } from '@/lib/i18n-server';

const SLOGANS = [
  "The People's Voice",
  "The People's Right",
  "Accountability to the People",
  "I do not want to be a leader; I want to create leadership",
  "18 Resolution for India",
  "Bharatiya Avijit Aawaz Party (BAAP)",
];

export default async function MarqueeTicker() {
  const { t } = await getT();
  const items = [...SLOGANS, ...SLOGANS];

  return (
    <div className="overflow-hidden border-y border-ink/10 bg-ink py-3">
      <div className="marquee-track flex w-max">
        {items.map((s, i) => (
          <span
            key={i}
            className="mx-6 flex items-center gap-3 whitespace-nowrap font-display text-sm font-bold uppercase tracking-wide text-ivory/90"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-marigold" />
            {t(s)}
          </span>
        ))}
      </div>
    </div>
  );
}