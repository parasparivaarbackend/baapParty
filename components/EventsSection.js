'use client';

import { useEffect, useState } from 'react';
import ZoomableImage from './ZoomableImage';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, PlayCircle } from 'lucide-react';
import VideoLightbox from './VideoLightbox';
import { getYouTubeThumbnail } from '@/lib/youtube';
import { useContentFilter } from '@/context/FilterContext';
import InlineContentFilter, {defaultFilterValue,isFilterActive,matchesFilter,} from "./InlineContentFilter";

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// Each filtered block gets its own heading, so /events no longer shows
// "Rallies & Conferences" twice (once for Rallies, once for Conferences).
const HEADINGS = {
  Rally: { eyebrow: 'Upcoming Rallies', title: 'Rally Schedule', empty: 'No rallies posted yet — check back soon.' },
  Conference: { eyebrow: 'Upcoming Conferences', title: 'Conferences & Chaupals', empty: 'No conferences posted yet — check back soon.' },
};

export default function EventsSection({ full = false, filter }) {
  const heading = HEADINGS[filter] || {
    eyebrow: 'Upcoming Schedule',
    title: 'Rallies & Conferences',
    empty: 'No events posted yet — check back soon.',
  };
  const [events, setEvents] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [locationFilter, setLocationFilter] = useState(defaultFilterValue);
  const active = isFilterActive(locationFilter);

  useEffect(() => {
    let alive = true;
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => alive && setEvents(Array.isArray(data) ? data : []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  let list = filter ? events.filter((e) => e.category === filter) : events;
  if (active) list = list.filter((e) => matchesFilter(e, locationFilter));
  const shown = full ? list : list.slice(0, 3);

  return (
    <section className="bg-paper py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="max-w-xl text-center sm:text-left">
            <span className="section-eyebrow text-xs font-bold uppercase text-saffron">
              {heading.eyebrow}
            </span>
            <h2 className="mt-3 flex flex-wrap items-center justify-center gap-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
              {heading.title}
              <InlineContentFilter
                type="events"
                value={locationFilter}
                onChange={setLocationFilter}
              />
            </h2>
          </div>
          {!full && (
            <Link
              href="/events"
              className="rounded-full border-2 border-ink/15 px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-all hover:border-ink hover:bg-ink hover:text-ivory"
            >
              View All Events
            </Link>
          )}
        </div>

        {shown.length === 0 && (
          <p className="mt-14 text-center text-sm text-ink-soft">
            {active
              ? "No events match the selected filter."
              : heading.empty}
          </p>
        )}

        <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((e, i) => (
            <motion.article
              key={e.id || e.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="group overflow-hidden rounded-2xl bg-white shadow-card transition-all hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <div
                className={`relative h-48 overflow-hidden ${e.mediaType === "video" && e.videoUrl ? "cursor-pointer" : ""}`}
                onClick={() =>
                  e.mediaType === "video" && e.videoUrl && setActiveVideo(e)
                }
              >
                <ZoomableImage
                  zoomable={e.mediaType !== "video"}
                  src={
                    e.image ||
                    getYouTubeThumbnail(e.videoUrl) ||
                    "https://picsum.photos/seed/event-placeholder/700/500"
                  }
                  alt={e.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {e.mediaType === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors group-hover:bg-ink/35">
                    <PlayCircle size={40} className="text-white drop-shadow" />
                  </span>
                )}
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-saffron">
                  {e.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display line-clamp-2 text-lg font-bold text-ink">
                  {e.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
                  {e.desc}
                </p>
                <div className="mt-5 space-y-2 border-t border-ink/8 pt-4 text-xs font-semibold text-ink-soft">
                  <p className="flex items-center gap-2">
                    <Calendar size={14} className="text-banyan" />{" "}
                    {formatDate(e.date)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={14} className="text-banyan" /> {e.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-banyan" /> {e.location}
                  </p>
                </div>
                <Link
                  href={`/events/${e.id}`}
                  className="mt-4 inline-block text-sm font-bold text-saffron transition-colors hover:text-saffron-dark"
                >
                  Read More →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <VideoLightbox
        open={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.videoUrl}
        title={activeVideo?.title}
      />
    </section>
  );
}
