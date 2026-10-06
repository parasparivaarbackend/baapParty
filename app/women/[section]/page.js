import { notFound } from 'next/navigation';
import WingSectionPage from '@/components/WingSectionPage';
import { WINGS } from '@/data/wings';

const wing = WINGS.women;
const pages = wing.sections.filter((s) => s.points);

export function generateStaticParams() {
  return pages.map((s) => ({ section: s.slug }));
}

export function generateMetadata({ params }) {
  const s = pages.find((x) => x.slug === params.section);
  return { title: s ? `${s.title} — ${wing.name}` : wing.name };
}

export default function Page({ params }) {
  const section = pages.find((s) => s.slug === params.section);
  if (!section) notFound();
  return <WingSectionPage wing={wing} section={section} />;
}
