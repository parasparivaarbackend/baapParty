"use client";

import { motion } from "framer-motion";
import { timeline } from "@/data/content";
import YatraRoadmap from "./YatraRoadmap";

export default function TimelineSection() {
  return (
    <section id="biography" className="scroll-mt-24 bg-ivory py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center">
          <span className="section-eyebrow text-xs font-bold uppercase text-banyan">
            Our Journey
          </span>
          {/* <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
            From a Village Meeting to a National Movement
          </h2> */}
        </div>

        <YatraRoadmap />

        {/* <div className="relative mt-16 space-y-10 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-1rem)] before:w-[2px] before:bg-ink/10 sm:before:left-1/2">
          {timeline.map((t, i) => (
            <motion.div
              key={t.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              className={`relative flex items-start gap-5 sm:w-1/2 ${
                i % 2 === 0 ? 'sm:ml-0 sm:pr-10 sm:text-right sm:flex-row-reverse' : 'sm:ml-auto sm:pl-10'
              }`}
            >
              <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-saffron text-[11px] font-bold text-white shadow-card sm:absolute sm:top-0 sm:-translate-x-1/2 sm:left-0" style={i % 2 === 0 ? { left: 'auto', right: '-16px', transform: 'translateX(50%)' } : {}}>
                •
              </span>
              <div>
                <p className="font-display text-xl font-extrabold text-saffron">{t.year}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t.text}</p>
              </div>
            </motion.div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
