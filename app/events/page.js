import PageHeader from '@/components/PageHeader';
import EventsSection from '@/components/EventsSection';
import CtaBanner from '@/components/CtaBanner';

export const metadata = {
  title: "Events — Bharatiya Avijit Aawaz Party",
};

export default function EventsPage() {
  return (
    <>
      <PageHeader eyebrow="Be There" title="Conferences, Rallies & Chaupals" crumb="Events" />
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
