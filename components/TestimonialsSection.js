'use client';

import { Quote } from 'lucide-react';
import { testimonials } from '@/data/content';

export default function TestimonialsSection() {
  const items = [...testimonials, ...testimonials];
  return (
    <section className="overflow-hidden bg-ink py-24">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <span className="section-eyebrow text-xs font-bold uppercase text-marigold">
          Voices From the Ground
        </span>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-ivory sm:text-4xl">
          What People Are Telling Us
        </h2>
      </div>

      <div className="relative mt-14">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
        <div className="marquee-track" style={{ animationDuration: '42s' }}>
          {items.map((t, i) => (
            <figure
              key={i}
              className="mx-4 flex w-80 shrink-0 flex-col rounded-2xl border border-ivory/10 bg-ink-soft/40 p-6"
            >
              <Quote className="mb-3 text-marigold" size={26} />
              <blockquote className="flex-1 text-sm leading-relaxed text-ivory/80">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-ivory/10 pt-4">
                <p className="font-display text-sm font-bold text-ivory">{t.name}</p>
                <p className="text-xs text-ivory/50">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
