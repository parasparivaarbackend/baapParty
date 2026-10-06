import PageHeader from '@/components/PageHeader';
import BlogSection from '@/components/BlogSection';
import CtaBanner from '@/components/CtaBanner';

export const metadata = {
  title: "Blog — Bharatiya Avijit Aawaz Party",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader eyebrow="Newsroom" title="Latest News & Press Releases" crumb="Blog" />
      <div id="press" className="scroll-mt-24">
        <BlogSection full />
      </div>
      <CtaBanner />
    </>
  );
}
