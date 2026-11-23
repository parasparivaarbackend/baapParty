'use client';

import Image from 'next/image';
import ZoomableImage from './ZoomableImage';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Users2 } from 'lucide-react';
import img from '@/public/image.png';
import { useLang } from '@/context/LanguageContext';

export default function Hero() {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden bg-ivory">
      <div className="absolute inset-0 bg-sunburst" />
      <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-banyan/10 blur-3xl" />
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-saffron/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-20 pt-14 lg:grid-cols-2 lg:px-8 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="section-eyebrow inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase text-saffron shadow-card">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-saffron" />
            {t("The People's Voice · The People's Right")}
          </span>

          {/* <h1 className="mt-6 font-display text-[2.2rem] font-extrabold leading-[1.1] text-ink sm:text-5xl lg:text-[3.3rem]">
            {t("Main neta nahi,")} <span className="text-banyan">{t("Netritva")}</span>
            <br />
            <span className="text-saffron">{t("Tayyar karna")}</span>
            <br />
            <span className="text-saffron">{t("Chahta hoon.")}</span>
          </h1> */}

          <h1 className="mt-6 font-display text-[2.2rem] font-extrabold leading-[1.1] text-ink sm:text-5xl lg:text-[3.3rem]">
            {t("I do not want to be a ")}{" "}
            <span className="text-banyan">{t("leader;")}</span>
            <br />
            <span className="text-saffron">{t("I want to create")}</span>
            <br />
            <span className="text-saffron">{t("leadership.")}</span>
          </h1>

          {/* <p className="mt-6 max-w-xl text-xl font-medium leading-relaxed text-ink-soft sm:text">
            {t(
              "Hamara sankalp ek aise Bharat ka nirmaan hai jo surakshit, samriddh, nyaypoorn aur sammanit ho. Ek aisa rashtra jahan kisan, yuva aur har aam nagrik ko apne sapno ko poora karne ka pura adhikaar mile.",
            )}
          </p> */}

          <p className="mt-6 max-w-xl text-xl font-medium leading-relaxed text-ink-soft sm:text">
            {t(
              "Our resolve is to build an India that is secure, prosperous, just, and respected—a nation where farmers, youth, and every ordinary citizen have the full right and opportunity to fulfil their dreams.",
            )}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/volunteer"
              className="group inline-flex items-center gap-2 rounded-full bg-saffron px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark hover:shadow-card-hover"
            >
              {t("Join the Movement")}
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/manifesto"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-all hover:border-ink hover:bg-ink hover:text-ivory"
            >
              <PlayCircle size={18} />
              {t("Read 18 Chapters")}
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {["a", "b", "c", "d"].map((s) => (
                <Image
                  key={s}
                  src={`/placeholders/avatar.svg`}
                  alt={t("Volunteer")}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full border-2 border-ivory object-cover"
                />
              ))}
            </div>
            <p className="text-sm text-ink-soft">
              <span className="font-display font-bold text-ink">96,000+</span>{" "}
              {t("volunteers already on board")}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] border-8 border-white shadow-card-hover">
            <ZoomableImage
              src={img}
              alt={t(
                "Bharatiya Avijit Aawaz Party rally with supporters holding flags",
              )}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          </div>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute -right-4 bottom-16 hidden w-44 rounded-2xl bg-ink p-4 text-ivory shadow-card sm:block"
          >
            <p className="font-display text-lg font-extrabold text-marigold">
              3,100+
            </p>
            <p className="text-[11px] text-ivory/70">
              {t("Villages reached this year")}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
