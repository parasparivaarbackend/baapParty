import { getT } from '@/lib/i18n-server';
import PageHeader from '@/components/PageHeader';
import VolunteerSection from '@/components/VolunteerSection';

// ✅ Volunteer पेज के Meta Tags
export const metadata = {
  title: "BAAP Party Volunteer | Join Bharatiya Avijit Aawaz Party",
  description: "Join the Bharatiya Avijit Aawaz Party as a volunteer. Register to participate in party activities, community initiatives and organisational programs.",
  keywords: [
    "BAAP Party Volunteer",
    "Bharatiya Avijit Aawaz Party Volunteer",
    "BAAP Party Volunteer Registration",
    "BAAP Party Join Us",
    "Join BAAP Party",
    "BAAP Party Membership",
    "Political Party Volunteer India",
    "Political Volunteer Registration",
    "BAAP Party Volunteer Program",
    "Volunteer Opportunities India",
    "BAAP Party Social Activities",
    "BAAP Party Volunteer Form"
  ],
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