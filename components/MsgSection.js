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
        text: 'Lord Shri Krishna inspires Avijit Aawaz Party to promote Dharma, justice, strong leadership and public welfare through BAAP Party Delhi.',
    },
    {
        text: 'Shri Krishna Himself did not make the throne His goal; instead, He guided capable people to establish Dharma. I too wish to follow this path through BAAP Party leadership, empowering responsible citizens to build a just and prosperous India with Avijit Aawaz Party.',
    },
    {
        text: 'Even though I am not even the dust of Shri Krishna’s feet, nor a nail of His toe, His teachings inspire me. Just as He guided Arjuna through the 18 chapters of the Bhagavad Gita, I aspire to inspire responsible leadership through Avijit Aawaz Party and strengthen BAAP Party India for justice and positive change.',
    },
    {
        text: 'I too will place before you the 18 contradictions of our country, like the 18 chapters of the Gita, so that new Arjunas for this future Mahabharata may be prepared. And the brave women of our country may be prepared to write the future of this nation.',
    },
];

export default function MsgSection() {
    const { t } = useLang();

    return (
        <section className="relative overflow-hidden bg-paper py-16 lg:py-24">
            {/* Decorative blurs */}
            <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-banyan/10 blur-3xl pointer-events-none" />
            <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-saffron/10 blur-3xl pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-3xl text-center"
                >
                    <span className="section-eyebrow inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-saffron shadow-sm border border-saffron/20">
                        <Sparkles size={14} />
                        {t("A Message from Paras Bhai ji")}
                    </span>
                    <h2 className="mt-6 font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">
                        {t("Main neta nahi,")} <span className="text-banyan">{t("Netritva")}</span>{' '}
                        <span className="text-saffron">{t("Tayyar karna Chahta hoon.")}</span>
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
                        {t("Main Neta Nahi, Netritva Tayyar Karna Chahta Hoon! Bharatiya Avijit Aawaz Party (BAAP Party) believes in empowering people, developing future leaders and strengthening democracy. Join the BAAP Party to support youth leadership,")}
                    </p>
                </motion.div>

                {/* Image + Content Grid */}
                <div className="mt-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">

                    {/* LEFT — IMAGE (sticky on desktop) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="lg:col-span-5 w-full"
                    >
                        <div className="lg:sticky lg:top-24 flex flex-col items-center">
                            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm sm:max-w-md overflow-hidden rounded-[2rem] border-4 border-white shadow-xl shadow-ink/5">
                                <ZoomableImage
                                    src={img}
                                    alt={t("Paras Bhai ji addressing the nation")}
                                    fill
                                    priority
                                    className="object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

                                {/* Quote overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                                    <Quote size={32} className="mb-3 text-marigold opacity-90" />
                                    <p className="font-display text-xl font-bold leading-snug text-white">
                                        {t("Stand up for Dharma and Justice.")}
                                    </p>
                                    <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-white/70">
                                        {t("— Paras Bhai ji")}
                                    </p>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                className="mx-auto mt-6 w-full max-w-sm sm:max-w-md rounded-2xl bg-ink p-5 text-ivory shadow-lg border border-white/10"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="font-display text-4xl font-extrabold text-marigold">18</span>
                                    <p className="text-sm leading-snug text-ivory/80 font-medium">
                                        {t("Contradictions of our nation — like the 18 chapters of the Gita")}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* RIGHT — CONTENT (Sirf Messages) */}
                    <div className="lg:col-span-7 space-y-6">
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group relative overflow-hidden rounded-2xl border border-ink/5 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                            >
                                {/* Left accent line */}
                                <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-saffron/80 transition-all duration-300 group-hover:bg-saffron group-hover:w-2" />

                                <p className="pl-4 text-base leading-relaxed text-ink-soft/90 font-medium">
                                    {t(m.text)}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* THE CALL — Ab yeh Full Width mein center me hai */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-16 max-w-5xl mx-auto relative overflow-hidden rounded-[2rem] bg-ink p-8 sm:p-12 text-ivory shadow-2xl"
                >
                    {/* Glow effects */}
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-saffron/20 blur-3xl pointer-events-none" />
                    <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-banyan/20 blur-3xl pointer-events-none" />

                    <div className="relative z-10 text-center flex flex-col items-center">
                        <p className="inline-block text-xs font-bold uppercase tracking-widest text-marigold border-b border-marigold/30 pb-1 mb-6">
                            {t("The Call")}
                        </p>

                        <p className="text-lg leading-relaxed text-ivory/90 max-w-3xl">
                            {t("I want the good children, good youth, honest women, experienced elders, farmers, soldiers, educated people, and social workers of the country to come together.")}
                        </p>

                        <div className="my-6 h-px w-24 bg-white/20" />

                        <p className="font-display text-xl sm:text-2xl font-bold leading-snug text-white max-w-4xl">
                            {t("Let us build a team ready not just to fight elections, but to understand the country's problems and solve them. Through BAAP Party India, we invite responsible citizens to become part of this mission. Join now and contribute your ideas, leadership and dedication towards building a stronger and better India.")}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}