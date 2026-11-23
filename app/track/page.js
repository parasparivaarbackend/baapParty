import { getT } from '@/lib/i18n-server';
import PageHeader from '@/components/PageHeader';
import TrackForm from '@/components/TrackForm';
import { isOtpEnabled } from '@/lib/otp';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Track Your Ticket' };

export default async function TrackPage() {
  const { t } = await getT();
  return (
    <>
      <PageHeader eyebrow={t("Help Desk")} title={t("Track Your Ticket")} crumb={t("Track Ticket")} />
      <section className="bg-ivory py-16">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <TrackForm otpEnabled={isOtpEnabled()} />
        </div>
      </section>
    </>
  );
}
