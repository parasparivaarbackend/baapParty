'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ScrollText, FileText, BookOpen, Scroll, Users2,
    ShieldCheck, UserCheck, Megaphone, BarChart3,
    ReceiptIndianRupee, ArrowRight, FileStack
} from 'lucide-react';
import { documents } from '@/data/documents';
import { useLang } from '@/context/LanguageContext';

const ICONS = {
    ScrollText, FileText, BookOpen, Scroll, Users2,
    ShieldCheck, UserCheck, Megaphone, BarChart3, ReceiptIndianRupee,
};

export default function DocumentsSection() {
    const { t } = useLang();
    return (
        <section className="relative overflow-hidden bg-paper py-16 lg:py-24">
            <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-banyan/10 blur-3xl" />
            <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-saffron/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <span className="section-eyebrow inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase text-saffron shadow-card">
                        <FileStack size={14} />
                        {t("Documents & Policies")}
                    </span>
                    <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[2.6rem]">
                        {t("Official")} <span className="text-saffron">{t("Documents")}</span> {t("of the Party")}
                    </h2>
                    <p className="mt-4 text-base text-ink-soft">
                        {t("The party's official documents will be made available in this section. Documents will be published according to their approval and availability.")}
                    </p>
                </motion.div>

                {/* DOCUMENTS GRID */}
                <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {documents.map((doc, i) => {
                        const Icon = ICONS[doc.icon] || FileText;
                        const isPublished = doc.status === 'Published';
                        const hasPdf = doc.pdfUrl && isPublished;

                        return (
                            <motion.div
                                key={doc.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
                            >
                                {hasPdf ? (
                                    <a
                                        href={doc.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative flex h-full flex-col rounded-2xl border border-ink/8 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ivory ring-2 ring-saffron/20 transition-colors group-hover:bg-saffron/10">
                                            <Icon size={22} className="text-saffron" />
                                        </div>
                                        <h3 className="mt-5 font-display text-lg font-bold leading-snug text-ink">
                                            {t(doc.title)}
                                        </h3>
                                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
                                            {t(doc.short)}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between border-t border-ink/8 pt-4 mt-6">
                                            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-banyan/10 text-banyan">
                                                {t(doc.status)}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-saffron transition-transform group-hover:translate-x-1">
                                                {t("View PDF")} <ArrowRight size={13} />
                                            </span>
                                        </div>
                                    </a>
                                ) : (
                                    <Link
                                        // href={`/documents/${doc.slug}`}
                                        href={"#"}
                                        className="group relative flex h-full flex-col rounded-2xl border border-ink/8 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ivory ring-2 ring-saffron/20 transition-colors group-hover:bg-saffron/10">
                                            <Icon size={22} className="text-saffron" />
                                        </div>
                                        <h3 className="mt-5 font-display text-lg font-bold leading-snug text-ink">
                                            {t(doc.title)}
                                        </h3>
                                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
                                            {t(doc.short)}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between border-t border-ink/8 pt-4 mt-6">
                                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${isPublished ? 'bg-banyan/10 text-banyan' : 'bg-saffron/10 text-saffron'}`}>
                                                {t(doc.status)}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-saffron transition-transform group-hover:translate-x-1">
                                                {t("View")} <ArrowRight size={13} />
                                            </span>
                                        </div>
                                    </Link>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* =========================================
                    NORMAL LEGAL DOCUMENT SECTION (No White Card)
                ========================================= */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className=" mt-20 max-w-4xl"
                >
                    {/* 16. Legal Information */}
                    <div className="mb-14">
                        <h3 className="font-display text-2xl font-extrabold text-ink mb-6">
                            {t("Legal Information")}
                        </h3>
                        <div className="space-y-5 text-base leading-relaxed text-ink-soft">
                            <p>
                                {t("The registration process of the organization under the name Bharatiya Avijit Aawaz Party is ongoing. Until registration is complete and the necessary confirmation is received from the relevant authority, the party will not be presented as a registered political party.")}
                            </p>
                            <p>
                                {t("The 18 chapters given on the website are the party's proposed ideas, resolves, and policy suggestions.")}
                            </p>
                            <p>
                                {t("The implementation of the schemes and financial assistance proposals mentioned in them will be in accordance with the relevant laws, financial resources, government policies, and constitutional processes.")}
                            </p>
                            <p>
                                {t("The purpose of the material published on the website is to make citizens aware of the party's ideas, proposals, and activities.")}
                            </p>
                        </div>
                    </div>

                    {/* 17. Privacy Policy */}
                    <div className="mb-14">
                        <h3 className="font-display text-2xl font-extrabold text-ink mb-6">
                            {t("Privacy Policy")}
                        </h3>
                        <div className="space-y-5 text-base leading-relaxed text-ink-soft">
                            <p>
                                {t("We respect the personal information of citizens who visit the website.")}
                            </p>
                            <p>
                                {t("Information received through the membership, contact, and suggestion forms will be used for the relevant application, communication, and organizational work.")}
                            </p>
                            <p>
                                {t("Efforts will be made to keep personal information secure in accordance with applicable laws and appropriate safeguards.")}
                            </p>
                            <p>
                                {t("No person's personal information will be made public without proper permission, except in circumstances where the law requires it.")}
                            </p>
                        </div>
                    </div>

                    {/* 18. Terms & Conditions */}
                    <div>
                        <h3 className="font-display text-2xl font-extrabold text-ink mb-6">
                            {t("Terms & Conditions")}
                        </h3>
                        <div className="space-y-5 text-base leading-relaxed text-ink-soft">
                            <p>
                                {t("While using the website, all visitors are expected to behave respectfully and responsibly.")}
                            </p>
                            <p>
                                {t("The material available on the website is for the party's ideas, proposals, and official information.")}
                            </p>
                            <p>
                                {t("The website must not be used for any false information, abusive content, illegal activity, or unauthorized payments.")}
                            </p>
                            <p>
                                {t("The party will have the right to make changes to the website's content and policies as necessary.")}
                            </p>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}