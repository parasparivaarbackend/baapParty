import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import CtaBanner from '@/components/CtaBanner';
import { getPublicChapters } from '@/lib/db/chapters';
import { localizeChapter } from '@/lib/chapterUtils';
import { getT } from '@/lib/i18n-server';

// Chapters are managed from Admin -> Chapters, so these pages are rendered on request.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = (await getPublicChapters()).find((x) => x.slug === slug);
  if (!c) return {};
  const title = `Chapter ${c.number}: ${c.title} — BAAP 18 Resolution for India`;
  return {
    title,
    description: c.summary,
    alternates: { canonical: `/manifesto/${c.slug}` },
    openGraph: {
      title,
      description: c.summary,
      type: "article",
      images: [c.image],
    },
  };
}

// Turn paragraphs into bullet points (lists attach under a lead-in line ending
// with ":"), then split them evenly across the chapter's images.
function buildSections(content, imageCount) {
  const nodes = [];
  for (const b of content) {
    if (b.type === 'p') nodes.push({ text: b.text, sub: false });
    else {
      const nested = nodes.length && nodes[nodes.length - 1].text.trim().endsWith(':');
      (b.items || []).forEach((it) => nodes.push({ text: it, sub: nested }));
    }
  }
  const k = Math.max(1, Math.min(imageCount, nodes.length));
  const size = Math.ceil(nodes.length / k);
  return Array.from({ length: k }, (_, i) => nodes.slice(i * size, (i + 1) * size)).filter((x) => x.length);
}

export default async function ChapterPage({ params }) {
  const { slug } = await params;
  const { t, lang } = await getT();
  const chapters = await getPublicChapters();
  const idx = chapters.findIndex((c) => c.slug === slug);
  if (idx === -1) notFound();
  const c = chapters[idx];
  const L = localizeChapter(c, lang, t);
  const images = c.images?.length ? c.images : [c.image].filter(Boolean);
  const sections = buildSections(L.content, images.length || 1);
  const prev = chapters[idx - 1];
  const next = chapters[idx + 1];
  const prevTitle = prev && localizeChapter(prev, lang, t).title;
  const nextTitle = next && localizeChapter(next, lang, t).title;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Chapter ${c.number}: ${c.title}`,
    description: c.summary,
    image: c.image,
    author: {
      "@type": "Organization",
      name: "Bharatiya Avijit Aawaz Party (BAAP)",
    },
    publisher: {
      "@type": "Organization",
      name: "Bharatiya Avijit Aawaz Party (BAAP)",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        eyebrow={t("Chapter {n} of {total}", { n: c.number, total: chapters.length })}
        title={L.title}
        crumb={t("Chapter {n}", { n: c.number })}
        sticky
      />

      <section className="bg-ivory py-16">
        <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 sm:space-y-10">
            {sections.map((sec, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 items-center gap-5 sm:gap-8 ${i % 2 === 1 ? "sm:grid-cols-[7fr,5fr]" : "sm:grid-cols-[5fr,7fr]"}`}
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-2xl border-4 border-white shadow-card-hover ${i % 2 === 1 ? "sm:order-2" : ""}`}
                >
                  <Image
                    src={images[i] ?? images[0] ?? '/placeholders/landscape.svg'}
                    alt={`${L.title} — ${i + 1}`}
                    fill
                    priority={i === 0}
                    unoptimized
                    sizes="(max-width: 640px) calc(100vw - 32px), 480px"
                    className="object-cover"
                  />
                </div>
                <div className="rounded-2xl border border-ink/8 bg-white p-6 shadow-card sm:p-8">
                  <ul className="space-y-4 text-base leading-relaxed text-ink-soft sm:text-[17px]">
                    {sec.map((pt, j) => (
                      <li
                        key={j}
                        className={`flex items-start gap-3 ${pt.sub ? "ml-6 text-[15px] sm:text-base" : ""}`}
                      >
                        <span
                          className={`mt-2.5 shrink-0 rounded-full ${pt.sub ? "h-1.5 w-1.5 bg-banyan" : "h-2 w-2 bg-saffron"}`}
                        />
                        <span>{pt.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {L.resolve && (
            <div className="mt-10 rounded-2xl bg-ink p-7 text-ivory shadow-card">
              <Quote size={22} className="text-marigold" />
              <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-marigold">
                {t("Our Resolve")}
              </p>
              <p className="mt-1 font-display text-xl font-bold leading-snug sm:text-2xl">
                {L.resolve}
              </p>
            </div>
          )}

          {L.closing.length > 0 && (
            <div className="mt-6 space-y-2 text-center font-display text-lg font-bold text-ink">
              {L.closing.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/manifesto/${prev.slug}`}
                className="group rounded-2xl border border-ink/8 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-saffron">
                  <ArrowLeft size={14} /> {t("Chapter {n}", { n: prev.number })}
                </span>
                <span className="mt-1 block font-display font-bold text-ink">
                  {prevTitle}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/manifesto/${next.slug}`}
                className="group rounded-2xl border border-ink/8 bg-white p-5 text-right shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover sm:col-start-2"
              >
                <span className="flex items-center justify-end gap-1.5 text-[11px] font-bold uppercase tracking-wide text-saffron">
                  {t("Chapter {n}", { n: next.number })} <ArrowRight size={14} />
                </span>
                <span className="mt-1 block font-display font-bold text-ink">
                  {nextTitle}
                </span>
              </Link>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/manifesto"
              className="inline-flex items-center gap-2 rounded-full bg-banyan px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-banyan-dark"
            >
              {t("View All Chapters")}
            </Link>
          </div>
        </article>
      </section>

      <CtaBanner />
    </>
  );
}
