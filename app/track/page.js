import PageHeader from '@/components/PageHeader';
import TrackForm from '@/components/TrackForm';
import { isOtpEnabled } from '@/lib/otp';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Track Your Ticket' };

export default function TrackPage() {
  return (
    <>
      <PageHeader eyebrow="Help Desk" title="Track Your Ticket" crumb="Track Ticket" />
      <section className="bg-ivory py-16">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <TrackForm otpEnabled={isOtpEnabled()} />
        </div>
      </section>
    </>
  );
}
