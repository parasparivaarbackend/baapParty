'use client';

import { useState } from 'react';
import { CalendarCheck, MapPinned, UsersRound } from 'lucide-react';
import VolunteerForm from '@/components/VolunteerForm';
import { useLang } from '@/context/LanguageContext';

const perks = [
  { icon: UsersRound, title: 'Booth-Level Teams', text: 'Join a team of 8-10 volunteers led by your local karyakarta.' },
  { icon: CalendarCheck, title: 'Flexible Hours', text: 'Contribute two hours a day or go full-time — you choose the pace.' },
  { icon: MapPinned, title: 'Local First', text: 'We match you to campaigning work within your own constituency.' },
];

export default function VolunteerSection() {
  const { t } = useLang();
  const [done, setDone] = useState(false);

  return (
    <section className="bg-ivory py-24">
      <div
        className={
          done
            ? 'mx-auto max-w-6xl px-6 lg:px-8'
            : 'mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 lg:grid-cols-5 lg:px-8'
        }
      >
        {/* Left content is hidden once the success card is showing */}
        {!done && (
          <div className="lg:col-span-2">
            <span className="section-eyebrow text-xs font-bold uppercase text-banyan">{t("Why Volunteer")}</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-ink">
              {t("Democracy Runs on People Who Show Up")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              {t("Every campaign win we've had traces back to volunteers who knocked on doors, staffed booths and organised chaupals. Fill in the form and our district coordinator will place you within your own constituency.")}
            </p>

            <div className="mt-8 space-y-5">
              {perks.map((p) => (
                <div key={p.title} className="flex gap-4 rounded-2xl border border-ink/8 bg-white p-5 shadow-card">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-saffron/10 text-saffron">
                    <p.icon size={20} />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold text-ink">{t(p.title)}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">{t(p.text)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={done ? '' : 'lg:col-span-3'}>
          <VolunteerForm onSuccessChange={setDone} />
        </div>
      </div>
    </section>
  );
}
