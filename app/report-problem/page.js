import { getT } from "@/lib/i18n-server";
import PageHeader from '@/components/PageHeader';
import GrievanceForm from '@/components/GrievanceForm';
import { CATEGORIES } from '@/lib/grievanceConfig';
import { isOtpEnabled } from '@/lib/otp';
import { channelAvailability } from '@/lib/notify/providers';

export const dynamic = 'force-dynamic'; // reads env flags at request time

export const metadata = { title: 'Report Your Problem — अपनी समस्या दर्ज करें' };

export default async function ReportProblemPage({ searchParams }) {
  const { t } = await getT();
  const params = await searchParams;
  const wing = ["youth", "women", "general"].includes(params?.wing)
    ? params.wing
    : "youth";
  const category = CATEGORIES[wing].includes(params?.category)
    ? params.category
    : "";
  return (
    <>
      <PageHeader
        eyebrow={t("Help Desk")}
        title={t("Report Your Problem")}
        crumb={t("Report Your Problem")}
      />
      <section className="bg-ivory py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <p className="mb-8 text-center text-sm text-ink-soft">
            {t("Fill this form, get a ticket number, and track your problem anytime at")}{" "}
            <a href="/track" className="font-bold text-saffron hover:underline">
              {t("Track Ticket")}
            </a>
            .
          </p>
          <GrievanceForm
            defaultWing={wing}
            defaultCategory={category}
            otpEnabled={isOtpEnabled()}
            channels={channelAvailability()}
          />
        </div>
      </section>
    </>
  );
}
