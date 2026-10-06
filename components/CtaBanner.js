'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, HandHeart, Users } from 'lucide-react';

export default function CtaBanner() {
  return (
    // <section className="relative overflow-hidden bg-gradient-to-br from-saffron via-saffron-dark to-banyan-dark py-20">
    <section className="relative overflow-hidden bg-gradient-to-br from-saffron via-saffron-dark to-banyan-dark py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border-[3px] border-dashed border-white/20"
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 text-center lg:px-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-white">
          <Flame size={30} />
        </span>
        <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
          This Election Belongs to the People. Be Part of It.
        </h2>
        <p className="max-w-xl text-white/85">
          Whether it&apos;s two hours at your local booth or a contribution
          toward printed material — every bit moves the sankalp forward.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/volunteer"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5"
          >
            <Users size={17} /> Become a Volunteer
          </Link>
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-saffron-dark shadow-card transition-all hover:-translate-y-0.5"
          >
            <HandHeart size={17} /> Contribute
          </Link>
        </div>
      </div>
    </section>
  );
}
