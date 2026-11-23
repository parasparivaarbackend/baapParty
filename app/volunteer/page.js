import { getT } from '@/lib/i18n-server';
import PageHeader from '@/components/PageHeader';
import VolunteerSection from '@/components/VolunteerSection';

export const metadata = {
  title: "Volunteer — Bharatiya Avijit Aawaz Party",
};

export default async function VolunteerPage() {
  const { t } = await getT();
  return (
    <>
      <PageHeader eyebrow={t("Get Involved")} title={t("Volunteer Signup Form")} crumb={t("Volunteer Form")} />

      <VolunteerSection />
    </>
  );
}
