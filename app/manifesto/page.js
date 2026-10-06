'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import CtaBanner from '@/components/CtaBanner';
import { manifestoDetails, faqs } from '@/data/content';
import { ChevronDown, Download } from 'lucide-react';

export default function ManifestoPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <PageHeader
        eyebrow="Sankalp 2026"
        title="Our Complete Election Manifesto"
        crumb="Manifesto"
      />

      <section className="bg-ivory py-20">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <p className="text-ink-soft leading-relaxed">
            Drafted from 900+ village chaupals, campus dialogues and farmer
            roundtables, this manifesto is costed line by line and tracked on a
            public dashboard once we take office.
          </p>
          {/* <button
            type="button"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-saffron px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark"
          >
            <Download size={17} /> Download Full PDF
          </button> */}

          <button
            type="button"
            onClick={() => {
              const link = document.createElement("a");
              link.href = "/Election Manifesto.pdf";
              link.download = "Election Manifesto.pdf";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-saffron px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark"
          >
            <Download size={17} /> Download Full PDF
          </button>
        </div>

        <div className="mx-auto mt-16 max-w-5xl space-y-6 px-6 lg:px-8">
          {manifestoDetails.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="grid grid-cols-1 gap-6 rounded-2xl border border-ink/8 bg-white p-7 shadow-card sm:grid-cols-[auto,1fr] sm:items-center sm:p-8"
            >
              <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl bg-ink px-6 py-5 text-center sm:w-40">
                <p className="font-display text-2xl font-extrabold text-marigold">
                  {m.stat}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-ivory/70">
                  {m.statLabel}
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-ink">
                  {m.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {m.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2.5 text-sm text-ink-soft"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center">
            <span className="section-eyebrow text-xs font-bold uppercase text-banyan">
              Questions
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-ink">
              Frequently Asked
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <div
                key={f.q}
                className="overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-card"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-sm font-bold text-ink sm:text-base">
                    {f.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-saffron transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-ink-soft">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
