'use client';

import Image from 'next/image';
import ZoomableImage from './ZoomableImage';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Users2 } from 'lucide-react';
import img from '@/public/image.png';

export default function Hero() {
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
            Sankalp 2026 · General Election
          </span>

          <h1 className="mt-6 font-display text-[2.6rem] font-extrabold leading-[1.08] text-ink sm:text-6xl">
            Rozgar. Kisan. <span className="text-banyan">Shiksha.</span>
            <br />
            <span className="text-saffron">Ek Naya Sankalp.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
            Bharatiya Avijit Aawaz Party is a grassroots movement of farmers,
            students and small entrepreneurs, working booth by booth to put
            jobs, farmer dignity and public education back at the centre of
            governance.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/volunteer"
              className="group inline-flex items-center gap-2 rounded-full bg-saffron px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark hover:shadow-card-hover"
            >
              Join the Movement
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
              Read Manifesto
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {["a", "b", "c", "d"].map((s) => (
                <Image
                  key={s}
                  src={`https://picsum.photos/seed/avatar-${s}/80/80`}
                  alt="Volunteer"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full border-2 border-ivory object-cover"
                />
              ))}
            </div>
            <p className="text-sm text-ink-soft">
              <span className="font-display font-bold text-ink">96,000+</span>{" "}
              volunteers already on board
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
              alt="Bharatiya Avijit Aawaz Party rally with supporters holding flags"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 backdrop-blur">
              <p className="font-display text-sm font-bold text-ink">
                Tiranga Padyatra
              </p>
              <p className="text-xs text-ink-soft">
                Day 61 of 90 · Marine Drive, Mumbai
              </p>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 top-10 hidden w-48 rounded-2xl bg-white p-4 shadow-card sm:block"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-banyan/10 text-banyan">
                <Users2 size={18} />
              </span>
              <div>
                <p className="font-display text-lg font-extrabold text-ink">
                  42.5K
                </p>
                <p className="text-[11px] text-ink-soft">Booth karyakartas</p>
              </div>
            </div>
          </motion.div>

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
              Villages reached this year
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
