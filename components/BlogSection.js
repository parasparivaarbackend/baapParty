'use client';

import { useEffect, useState } from 'react';
import ZoomableImage from './ZoomableImage';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import VideoLightbox from './VideoLightbox';
import { getYouTubeThumbnail } from '@/lib/youtube';
import InlineContentFilter, {defaultFilterValue,isFilterActive,matchesFilter,} from "./InlineContentFilter";

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function BlogSection({ full = false }) {
  const [blogPosts, setBlogPosts] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [locationFilter, setLocationFilter] = useState(defaultFilterValue);
  const active = isFilterActive(locationFilter);

  useEffect(() => {
    let alive = true;
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => alive && setBlogPosts(Array.isArray(data) ? data : []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const filtered = active
    ? blogPosts.filter((p) => matchesFilter(p, locationFilter))
    : blogPosts;
  const shown = full ? filtered : filtered.slice(0, 3);

  return (
    <section className="bg-paper py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="max-w-xl text-center sm:text-left">
            <span className="section-eyebrow text-xs font-bold uppercase text-saffron">
              From the Newsroom
            </span>
            <h2 className="mt-3 flex flex-wrap items-center justify-center gap-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Latest News &amp; Press
              <InlineContentFilter
                type="blog"
                value={locationFilter}
                onChange={setLocationFilter}
              />
            </h2>
          </div>
          {!full && (
            <Link
              href="/blog"
              className="rounded-full border-2 border-ink/15 px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-all hover:border-ink hover:bg-ink hover:text-ivory"
            >
              Visit Blog
            </Link>
          )}
        </div>

        {shown.length === 0 && (
          <p className="mt-14 text-center text-sm text-ink-soft">
            {active
              ? "No posts match the selected filter."
              : "No posts published yet — check back soon."}
          </p>
        )}

        <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((b, i) => (
            <motion.article
              key={b.id || b.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="group overflow-hidden rounded-2xl bg-white shadow-card transition-all hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <div
                className={`relative h-48 overflow-hidden ${b.mediaType === "video" && b.videoUrl ? "cursor-pointer" : ""}`}
                onClick={() =>
                  b.mediaType === "video" && b.videoUrl && setActiveVideo(b)
                }
              >
                <ZoomableImage
                  zoomable={b.mediaType !== "video"}
                  src={
                    b.image ||
                    getYouTubeThumbnail(b.videoUrl) ||
                    "https://picsum.photos/seed/blog-placeholder/700/500"
                  }
                  alt={b.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {b.mediaType === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors group-hover:bg-ink/35">
                    <PlayCircle size={40} className="text-white drop-shadow" />
                  </span>
                )}
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-banyan">
                  {b.category}
                </span>
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
                  {formatDate(b.date)} · {b.author}
                </p>
                <h3 className="mt-2 line-clamp-2 font-display text-lg font-bold leading-snug text-ink">
                  {b.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
                  {b.excerpt}
                </p>
                <Link
                  href={`/blog/${b.id}`}
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
