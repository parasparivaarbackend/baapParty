'use client';

import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, HeartPulse, Leaf, Users, Wheat } from 'lucide-react';
import Link from 'next/link';
import { pillars } from '@/data/content';

const ICONS = {
  briefcase: Briefcase,
  wheat: Wheat,
  'graduation-cap': GraduationCap,
  'heart-pulse': HeartPulse,
  users: Users,
  leaf: Leaf,
};

export default function PillarsSection() {
  return (
    <section className="bg-ivory py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow text-xs font-bold uppercase text-banyan">
            Our Six Pillars
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
            A Manifesto Built From the Ground Up
          </h2>
          <p className="mt-4 text-ink-soft">
            Every pillar was drafted from 900+ village chaupals, campus dialogues
            and farmer roundtables held over the last eighteen months.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => {
            const Icon = ICONS[p.icon];
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="group rounded-2xl border border-ink/8 bg-white p-7 shadow-card transition-all hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-saffron/10 text-saffron transition-colors group-hover:bg-saffron group-hover:text-white">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/manifesto"
            className="inline-flex items-center gap-2 rounded-full bg-banyan px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-banyan-dark"
          >
            View Full Manifesto
          </Link>
        </div>
      </div>
    </section>
  );
}
