import PageHeader from '@/components/PageHeader';
import BlogSection from '@/components/BlogSection';
import CtaBanner from '@/components/CtaBanner';
import { getT } from '@/lib/i18n-server';

export const metadata = {
  title: "Blog — Bharatiya Avijit Aawaz Party",
};

export default async function BlogPage() {
  const { t } = await getT();
  return (
    <>
      <PageHeader eyebrow={t("Newsroom")} title={t("Latest News & Press Releases")} crumb={t("Blog")} />
      <div id="press" className="scroll-mt-24">
        <BlogSection full />
      </div>
      <CtaBanner />
    </>
  );
}
