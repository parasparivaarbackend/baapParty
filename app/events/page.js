import PageHeader from '@/components/PageHeader';
import EventsSection from '@/components/EventsSection';
import CtaBanner from '@/components/CtaBanner';
import { getT } from '@/lib/i18n-server';

// ✅ Events पेज के Meta Tags
export const metadata = {
  title: "BAAP Party Events | Political Rallies, Meetings & Updates",
  description: "Explore Bharatiya Avijita Aawaz Party events, political rallies, public meetings, conferences and party activities across India. Stay updated.",
  keywords: [
    "BAAP Party Events",
    "Bharatiya Avijita Aawaz Party Events",
    "BAAP Party Latest Events",
    "BAAP Party Political Rallies",
    "BAAP Party Meetings",
    "BAAP Party Activities",
    "BAAP Party Conferences",
    "Political Events in India",
    "BAAP Party Punjab Events",
    "BAAP Party Delhi Events"
  ],
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