import PageHeader from '@/components/PageHeader';
import GallerySection from '@/components/GallerySection';
import CtaBanner from '@/components/CtaBanner';
import { getT } from '@/lib/i18n-server';

export const metadata = {
  title: "Gallery — Bharatiya Avijit Aawaz Party",
};

export default async function GalleryPage() {
  const { t } = await getT();
  return (
    <>
      <PageHeader eyebrow={t("Moments")} title={t("Photo & Video Gallery")} crumb={t("Gallery")} />
      <GallerySection full />
      <CtaBanner />
    </>
  );
}
