import PageHeader from '@/components/PageHeader';
import EventsSection from '@/components/EventsSection';
import CtaBanner from '@/components/CtaBanner';
import { getT } from '@/lib/i18n-server';

export const metadata = {
  title: "Events — Bharatiya Avijit Aawaz Party",
};

export default async function EventsPage() {
  const { t } = await getT();
  return (
    <>
      <PageHeader eyebrow={t("Be There")} title={t("Conferences, Rallies & Chaupals")} crumb={t("Events")} />
      <div id="rally-schedule" className="scroll-mt-24">
        <EventsSection full filter="Rally" />
      </div>
      <div id="conferences" className="scroll-mt-24">
        <EventsSection full filter="Conference" />
      </div>
      <CtaBanner />
    </>
  );
}
