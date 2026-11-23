// components/MsgSection.jsx
'use client';

import Image from 'next/image';
import ZoomableImage from './ZoomableImage';
import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';
import img from '@/public/image.png'; // apni image ka path daal do
import { useLang } from '@/context/LanguageContext';

const messages = [
    {
        text: 'Lord Shri Krishna gave us a very great message. When injustice increases, when the time comes to protect Dharma and justice, then capable people must stand up.',
    },
    {
        text: 'Shri Krishna Himself did not make the throne His goal; instead, He guided capable people for the establishment of Dharma. I too wish to play the same role.',
    },
    {
        text: 'Even though I am not even the dust of Shri Krishna\u2019s feet, nor even a nail of His toe \u2014 but just as He recited the 18 chapters of the Gita and prepared Arjuna for the Mahabharata...',
    },
    {
        text: 'I too will place before you the 18 contradictions of our country, like the 18 chapters of the Gita, so that new Arjunas for this future Mahabharata may be prepared. And the brave women of our country may be prepared to write the future of this nation.',
    },
];

export default function MsgSection() {
    const { t } = useLang();
    return (
        <section className="relative overflow-hidden bg-paper py-16 lg:py-24">
            {/* Decorative blurs — theme ke hisaab se */}
            <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-banyan/10 blur-3xl" />
            <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-saffron/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <span className="section-eyebrow inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase text-saffron shadow-card">
                        <Sparkles size={14} />
                        {t("A Message from Paras Bhai ji")}
                    </span>
                    <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[2.6rem]">
                        {t("Main neta nahi,")} <span className="text-banyan">{t("Netritva")}</span>{' '}
                        <span className="text-saffron">{t("Tayyar karna Chahta hoon.")}</span>
                    </h2>
                    <p className="mt-4 text-base text-ink-soft">
                        {t("My dear citizens of India, my younger brothers and sisters, my children, and my elders — I wish you all happiness and good health. This is my heartfelt prayer.")}
                    </p>
                </motion.div>

                {/* Image + Content Grid */}
                <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
                    {/* LEFT — IMAGE (sticky on desktop) */}
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
                                    alt={t("Paras Bhai ji addressing the nation")}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

                                {/* Quote overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <Quote size={28} className="mb-2 text-marigold" />
                                    <p className="font-display text-lg font-bold leading-snug text-ivory">
                                        {t("Stand up for Dharma and Justice.")}
                                    </p>
                                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ivory/70">
                                        {t("— Paras Bhai ji")}
                                    </p>
                                </div>
                            </div>

                            {/* Floating badge (theme jaisa) */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                className="mx-auto mt-6 hidden w-full max-w-md rounded-2xl bg-ink p-4 text-ivory shadow-card sm:block"
                            >
                                <p className="font-display text-2xl font-extrabold text-marigold">18</p>
                                <p className="text-[11px] text-ivory/70">
                                    {t("Contradictions of our nation — like the 18 chapters of the Gita")}
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* RIGHT — CONTENT */}
                    <div className="space-y-5 lg:col-span-7">
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.45, delay: i * 0.08 }}
                                className="group relative rounded-2xl border border-ink/8 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                            >
                                <span className="absolute left-0 top-6 h-8 w-1 rounded-r-full bg-saffron transition-all group-hover:h-10" />
                                <p className="pl-3 text-[15px] leading-relaxed text-ink-soft">
                                    {t(m.text)}
                                </p>
                            </motion.div>
                        ))}

                        {/* Call to Unity — highlighted */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.5, delay: 0.35 }}
                            className="relative overflow-hidden rounded-2xl bg-ink p-7 text-ivory shadow-card-hover"
                        >
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-saffron/20 blur-2xl" />
                            <div className="relative">
                                <p className="text-xs font-bold uppercase tracking-wide text-marigold">
                                    {t("The Call")}
                                </p>
                                <p className="mt-3 text-[15px] leading-relaxed text-ivory/90">
                                    {t("I want the good children, good youth, honest women, experienced elders, farmers, soldiers, educated people, and social workers of the country to come together.")}
                                </p>
                                <p className="mt-3 font-display text-lg font-bold leading-snug text-white">
                                    {t("Let us build a team that is ready not just to fight elections, but to understand the problems of the country and solve them.")}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}