import ManifestoView from '@/components/ManifestoView';
import { getPublicChapters } from '@/lib/db/chapters';

// Chapters are managed from Admin -> Chapters, so this page is rendered on request.
export const dynamic = 'force-dynamic';

export default async function ManifestoPage() {
  const chapters = await getPublicChapters();
  // Only what the list needs (keeps the page payload small).
  const list = chapters.map((c) => ({ slug: c.slug, number: c.number, title: c.title, hi: { title: c.hi?.title || '' } }));
  return <ManifestoView chapters={list} />;
}
