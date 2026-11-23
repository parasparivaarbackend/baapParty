// components/GuidanceSection.jsx
'use client';

import ZoomableImage from './ZoomableImage';
import { motion } from 'framer-motion';
import { Quote, Compass, ShieldCheck, Users2, BookOpen } from 'lucide-react';
import img from '@/public/image.png'; // apni image path daal do
import { useLang } from '@/context/LanguageContext';

const points = [
  {
    icon: ShieldCheck,
    title: "No Desire for a Post",
    text: "Paras Bhai ji has a clear vision — he has no longing for any position or chair. His aim is not power, but purpose.",
  },
  {
    icon: Users2,
    title: "Preparing Capable Leaders",
    text: "His mission is to prepare capable, honest, disciplined, and people of character who can take up the responsibility of the nation.",
  },
  {
    icon: BookOpen,
    title: "18 Chapters of Society of Indians for internal Strength",
    text: "Just as Lord Shri Krishna guided Arjuna, Paras Bhai ji wishes to place 18 important subjects before the nation — in the form of 18 chapters.",
  },
  {
    icon: Compass,
    title: "New Arjunas & Veeranganas",
    text: "He considers himself no more than the dust of Shri Krishna\u2019s feet. Yet his effort is that through these ideas, new Arjunas and brave women may rise to shoulder nation-building.",
  },
];

export default function GuidanceSection() {
    const { t, isHindi } = useLang();
    return (
        <section className="relative overflow-hidden bg-ivory py-16 lg:py-24">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-sunburst opacity-60" />
            <div className="absolute -left-28 top-20 h-80 w-80 rounded-full bg-banyan/10 blur-3xl" />
            <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-saffron/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <span className="section-eyebrow inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase text-saffron shadow-card">
                        <Compass size={14} />
                        {t("Guidance · Margdarshan")}
                    </span>
                    <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[2.6rem]">
                        {t("Not a Position,")} <br className="hidden sm:block" />
                        {isHindi ? (
                            <>
                                {t("but a")} <span className="text-banyan">{t("Guidance")}</span>{' '}
                                {t("of")} <span className="text-saffron">{t("Sankalp")}</span>
                            </>
                        ) : (
                            <>
                                {t("but a")} <span className="text-saffron">{t("Sankalp")}</span> {t("of")}{' '}
                                <span className="text-banyan">{t("Guidance")}</span>
                            </>
                        )}
                    </h2>
                    <p className="mt-4 text-base text-ink-soft">
                        {t("Paras Bhai ji's vision is simple — to prepare the right people, not to claim the throne.")}
                    </p>
                </motion.div>

                {/* Main grid */}
                <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
                    {/* LEFT — image + role card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="lg:col-span-5"
                    >
                        <div className="lg:sticky lg:top-8">
                            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] border-8 border-white shadow-card-hover">
                                <ZoomableImage
                                    src={img}
                                    alt={t("Paras Bhai ji — guidance for the nation")}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <p className="font-display text-lg font-bold leading-snug text-ivory">
                                        &ldquo;{t("I want to prepare Netritva, not become a Neta.")}&rdquo;
                                    </p>
                                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ivory/70">
                                        {t("— Paras Bhai ji")}
                                    </p>
                                </div>
                            </div>

                            {/* Proposed Role card */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mx-auto mt-6 w-full max-w-md rounded-2xl border border-ink/8 bg-white p-5 shadow-card"
                            >
                                <p className="text-[11px] font-bold uppercase tracking-wide text-saffron">
                                    {t("Proposed Role")}
                                </p>
                                <p className="mt-2 font-display text-lg font-extrabold text-ink">
                                    {t("Guide — Not a Formal Party Post")}
                                </p>
                                <p className="mt-1 text-sm text-ink-soft">
                                    {t("A mentor to capable leaders, not a claimant to any chair.")}
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* RIGHT — numbered guidance points */}
                    <div className="lg:col-span-7">
                        <div className="relative space-y-4">
                            {/* Vertical dashed line */}
                            <span className="absolute left-[27px] top-4 bottom-4 hidden w-px border-l-2 border-dashed border-ink/10 sm:block" />

                            {points.map((p, i) => {
                                const Icon = p.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: '-40px' }}
                                        transition={{ duration: 0.45, delay: i * 0.08 }}
                                        className="group relative flex gap-4 rounded-2xl border border-ink/8 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                                    >
                                        {/* Numbered icon badge */}
                                        <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ivory ring-2 ring-saffron/20">
                                            <Icon size={20} className="text-saffron" />
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-display text-xs font-extrabold text-banyan">
                                                    0{i + 1}
                                                </span>
                                                <h3 className="font-display text-lg font-bold text-ink">
                                                    {t(p.title)}
                                                </h3>
                                            </div>
                                            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                                                {t(p.text)}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Full-width quote banner */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="relative mt-16 overflow-hidden rounded-[2rem] bg-ink px-8 py-12 text-center text-ivory shadow-card-hover sm:px-14"
                >
                    <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-saffron/20 blur-2xl" />
                    <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-banyan/25 blur-2xl" />

                    <Quote size={36} className="mx-auto mb-4 text-marigold" />
                    <p className="mx-auto max-w-3xl font-display text-xl font-bold leading-snug text-white sm:text-2xl lg:text-[1.7rem]">
                        &ldquo;{t("I do not seek power for myself. I want to prepare capable people who can take up the responsibility of the nation. I want to prepare Netritva, not become a Neta.")}&rdquo;
                    </p>
                    <p className="mt-5 text-xs font-bold uppercase tracking-widest text-marigold">
                        {t("— Paras Bhai ji")}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}