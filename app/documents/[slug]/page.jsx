// app/documents/[slug]/page.jsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    ScrollText, FileText, BookOpen, Scroll, Users2,
    ShieldCheck, UserCheck, Megaphone, BarChart3,
    ReceiptIndianRupee, ArrowLeft,
} from 'lucide-react';
import { documents } from '@/data/documents';
import { getT } from '@/lib/i18n-server';

const ICONS = {
    ScrollText, FileText, BookOpen, Scroll, Users2,
    ShieldCheck, UserCheck, Megaphone, BarChart3, ReceiptIndianRupee,
};

// SEO Metadata
export async function generateMetadata({ params }) {
    const resolvedParams = await params; // Next.js 15 ke liye
    const doc = documents.find((d) => d.slug === resolvedParams.slug);
    if (!doc) return { title: 'Document Not Found' };
    return {
        title: `${doc.title} · Documents · BAAP`,
        description: doc.short,
    };
}

// Static Generation
export function generateStaticParams() {
    return documents.map((d) => ({ slug: d.slug }));
}

const formatDate = (d, locale = 'en-IN') =>
    d
        ? new Date(d).toLocaleDateString(locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        : null;

export default async function DocumentDetailPage({ params }) {
    const resolvedParams = await params; // Next.js 15 ke liye
    const { t, locale } = await getT();
    const doc = documents.find((d) => d.slug === resolvedParams.slug);
    if (!doc) notFound();

    const Icon = ICONS[doc.icon] || FileText;
    const isPublished = doc.status === 'Published';

    return (
        <section className="relative overflow-hidden bg-paper py-16 lg:py-20">
            <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-banyan/10 blur-3xl" />
            <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-saffron/10 blur-3xl" />

            <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
                <Link
                    href="/documents"
                    className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition-colors hover:text-saffron"
                >
                    <ArrowLeft size={16} />
                    {t("Back to all documents")}
                </Link>

                <div className="mt-6 rounded-[2rem] border border-ink/8 bg-white p-8 shadow-card sm:p-10">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-ivory ring-2 ring-saffron/20">
                            <Icon size={26} className="text-saffron" />
                        </div>
                        <div>
                            <span
                                className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${isPublished ? 'bg-banyan/10 text-banyan' : 'bg-saffron/10 text-saffron'
                                    }`}
                            >
                                {t(doc.status)}
                            </span>
                            <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
                                {t(doc.title)}
                            </h1>
                            {doc.updatedAt && (
                                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                                    {t("Last updated:")} {formatDate(doc.updatedAt, locale)}
                                </p>
                            )}
                        </div>
                    </div>

                    <p className="mt-6 text-base leading-relaxed text-ink-soft">
                        {t(doc.short)}
                    </p>


                    {doc.pdfUrl && (
                        <div className="mt-6">
                            <a
                                href={doc.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-saffron px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark hover:shadow-card-hover"
                            >
                                <FileText size={18} />
                                {t("View PDF Document")}
                            </a>
                        </div>
                    )}

                    <div className="mt-8 space-y-4 border-t border-ink/8 pt-8">
                        {doc.content.map((para, i) => (
                            <p key={i} className="text-[15px] leading-relaxed text-ink-soft">
                                {t(para)}
                            </p>
                        ))}
                    </div>

                    <div className="mt-8 space-y-4 border-t border-ink/8 pt-8">
                        {doc.content.map((para, i) => (
                            <p key={i} className="text-[15px] leading-relaxed text-ink-soft">
                                {t(para)}
                            </p>
                        ))}
                    </div>

                    {!isPublished && (
                        <div className="mt-8 rounded-2xl bg-ink p-6 text-ivory">
                            <p className="font-display text-lg font-bold">
                                {t("This document is coming soon.")}
                            </p>
                            <p className="mt-1 text-sm text-ivory/80">
                                {t("It will be published as soon as it is approved and available.")}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}