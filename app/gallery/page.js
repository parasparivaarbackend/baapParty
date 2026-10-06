import PageHeader from '@/components/PageHeader';
import GallerySection from '@/components/GallerySection';
import CtaBanner from '@/components/CtaBanner';

export const metadata = {
  title: "Gallery — Bharatiya Avijit Aawaz Party",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader eyebrow="Moments" title="Photo & Video Gallery" crumb="Gallery" />
      <GallerySection full />
      <CtaBanner />
    </>
  );
}
