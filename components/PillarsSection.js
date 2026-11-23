"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Apple,
  Ban,
  Equal,
  Flame,
  Gavel,
  HandHelping,
  HeartPulse,
  Eye,
  Lock,
  Megaphone,
  Pill,
  Plane,
  Shield,
  Sparkles,
  UserCheck,
  Vote,
  Wheat,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { localizeChapter } from "@/lib/chapterUtils";
import { useLang } from "@/context/LanguageContext";

const ICONS = {
  apple: Apple,
  flame: Flame,
  vote: Vote,
  shield: Shield,
  wrench: Wrench,
  sparkles: Sparkles,
  plane: Plane,
  lock: Lock,
  "user-check": UserCheck,
  pill: Pill,
  eye: Eye,
  megaphone: Megaphone,
  gavel: Gavel,
  "heart-pulse": HeartPulse,
  wheat: Wheat,
  "hand-helping": HandHelping,
  ban: Ban,
  equal: Equal,
};

export default function PillarsSection() {
  const { t, lang } = useLang();
  const [pillars, setPillars] = useState([]);

  // Chapters are managed in Admin -> Chapters; the built-in list is only the first paint / fallback.
  useEffect(() => {
    let alive = true;
    fetch("/api/chapters")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => alive && Array.isArray(d) && setPillars(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!pillars.length) return null; // no chapters added yet

  return (
    <section className="bg-ivory py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow text-xs font-bold uppercase text-banyan">
            {t("This Is Not the Gita — These Are Our 18 Chapters")}
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
            {t("18 Resolution for India")}
          </h2>
          <p className="mt-4 text-ink-soft">
            {t(
              "We present 18 important challenges facing the country as 18 chapters. They form the basis of our ideas, policy proposals, and future action plan.",
            )}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => {
            const Icon = ICONS[p.icon] || Sparkles;
            return (
              <Link
                key={p.slug}
                href={`/manifesto/${p.slug}`}
                className="block h-full"
              >
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  className="group h-full rounded-2xl border border-ink/8 bg-white p-7 shadow-card transition-all hover:-translate-y-1.5 hover:shadow-card-hover"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-saffron/10 text-saffron transition-colors group-hover:bg-saffron group-hover:text-white">
                    <Icon size={22} />
                  </span>
                  <p className="mt-5 text-[11px] font-bold uppercase tracking-wide text-saffron">
                    {t("Chapter {number}", { number: p.number })}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold text-ink">
                    {localizeChapter(p, lang, t).title}
                  </h3>
                </motion.div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/manifesto"
            className="inline-flex items-center gap-2 rounded-full bg-banyan px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-banyan-dark"
          >
            {t("View All Chapters")}
          </Link>
        </div>
      </div>
    </section>
  );
}
