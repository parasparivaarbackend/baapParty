import PageHeader from '@/components/PageHeader';
import GrievanceForm from '@/components/GrievanceForm';
import { CATEGORIES } from '@/lib/grievanceConfig';
import { isOtpEnabled } from '@/lib/otp';
import { channelAvailability } from '@/lib/notify/providers';

export const dynamic = 'force-dynamic'; // reads env flags at request time

export const metadata = { title: 'Report Your Problem — अपनी समस्या दर्ज करें' };

export default function ReportProblemPage({ searchParams }) {
  const wing = ['youth', 'women', 'general'].includes(searchParams?.wing) ? searchParams.wing : 'youth';
  const category = CATEGORIES[wing].includes(searchParams?.category) ? searchParams.category : '';
  return (
    <>
      <PageHeader eyebrow="Help Desk" title="अपनी समस्या दर्ज करें" crumb="Report Your Problem" />
      <section className="bg-ivory py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <p className="mb-8 text-center text-sm text-ink-soft">
            Fill this form, get a ticket number, and track your problem anytime at{' '}
            <a href="/track" className="font-bold text-saffron hover:underline">Track Ticket</a>.
          </p>
          <GrievanceForm defaultWing={wing} defaultCategory={category} otpEnabled={isOtpEnabled()} channels={channelAvailability()} />
        </div>
      </section>
    </>
  );
}
