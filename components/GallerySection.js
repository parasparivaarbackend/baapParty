// 'use client';

// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import { PlayCircle, Maximize2, Camera, Video, Sparkles, MapPin } from 'lucide-react';
// import VideoLightbox from './VideoLightbox';

// export default function GallerySection({ full = false }) {
//   const [activeTab, setActiveTab] = useState('all');
//   const [galleryPhotos, setGalleryPhotos] = useState([]);
//   const [galleryVideos, setGalleryVideos] = useState([]);
//   const [activeVideo, setActiveVideo] = useState(null);

//   useEffect(() => {
//     let alive = true;
//     fetch('/api/gallery')
//       .then((r) => r.json())
//       .then((data) => {
//         if (!alive || !Array.isArray(data)) return;
//         setGalleryPhotos(data.filter((g) => g.type === 'photo'));
//         setGalleryVideos(data.filter((g) => g.type === 'video'));
//       })
//       .catch(() => {});
//     return () => {
//       alive = false;
//     };
//   }, []);

//   // Filter logic (if category exists in photo objects, else fallback to slice)
//   const categories = ['all', 'Rallies', 'Padyatra', 'Youth', 'Meetings'];

//   const displayPhotos = full ? galleryPhotos : galleryPhotos.slice(0, 8); // Showing 8 uniform small cards in hero mode

//   const filteredPhotos = activeTab === 'all'
//     ? displayPhotos
//     : displayPhotos.filter(p => p.category?.toLowerCase() === activeTab.toLowerCase());

//   return (
//     <section className="bg-ivory py-20 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
//       <div className="mx-auto max-w-7xl">

//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-ink/10">
//           <div>
//             <span className="inline-flex items-center gap-2 rounded-full border border-banyan/20 bg-banyan/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-banyan">
//               <Camera size={14} />
//               Ground Coverage
//             </span>
//             <h2 id="photos" className="scroll-mt-24 mt-4 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">
//               Campaign Photo Gallery
//             </h2>
//             <p className="mt-2 text-sm text-ink-soft">
//               Real moments from our booth-level padyatras and ground meetings.
//             </p>
//           </div>

//           {!full && (
//             <Link
//               href="/gallery"
//               className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-ivory transition-all hover:bg-saffron hover:shadow-lg active:scale-95"
//             >
//               View Full Gallery
//               <Sparkles size={14} className="transition-transform group-hover:rotate-12" />
//             </Link>
//           )}
//         </div>

//         {/* Category Filters (Only in Full view or optional) */}
//         {full && (
//           <div className="mt-8 flex flex-wrap gap-2">
//             {categories.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setActiveTab(cat)}
//                 className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === cat
//                     ? 'bg-saffron text-white shadow-md shadow-saffron/20'
//                     : 'bg-white text-ink-soft hover:bg-ink/5 hover:text-ink'
//                   }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* UNIFORM PHOTO GRID (4 cols on desktop, 3 on tablet, 2 on mobile) */}
//         <motion.div layout className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
//           <AnimatePresence>
//             {filteredPhotos.map((p, i) => (
//               <motion.div
//                 layout
//                 key={p.id || p.src || i}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.35, delay: i * 0.04 }}
//                 className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-black/5 shadow-sm border border-ink/5"
//               >
//                 {/* Image with object-cover for perfect alignment */}
//                 <Image
//                   src={p.src}
//                   alt={p.caption || 'Campaign Moment'}
//                   fill
//                   sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
//                   className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
//                 />

//                 {/* Subtle Glassmorphic Hover Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100 flex flex-col justify-between p-4">
//                   <div className="flex justify-end">
//                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform group-hover:scale-110">
//                       <Maximize2 size={14} />
//                     </span>
//                   </div>

//                   <div>
//                     {p.location && (
//                       <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-saffron mb-1">
//                         <MapPin size={10} />
//                         {p.location}
//                       </p>
//                     )}
//                     <p className="text-xs font-semibold leading-tight text-white line-clamp-2">
//                       {p.caption}
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </motion.div>

//         {/* UNIFORM VIDEO GALLERY (If full view is enabled) */}
//         {full && (
//           <div className="mt-20 pt-16 border-t border-ink/10">
//             <div className="flex items-center gap-2 text-saffron font-bold text-xs uppercase tracking-wider">
//               <Video size={16} />
//               Video Highlights
//             </div>
//             <h2 id="videos" className="scroll-mt-24 mt-2 font-display text-3xl font-black text-ink sm:text-4xl">
//               Campaign Speeches & Coverage
//             </h2>

//             <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {galleryVideos.map((v, i) => (
//                 <motion.div
//                   key={v.id || v.title || i}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.4, delay: i * 0.08 }}
//                   onClick={() => v.videoUrl && setActiveVideo(v)}
//                   className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-ink shadow-md cursor-pointer"
//                 >
//                   <Image
//                     src={v.thumb || 'https://picsum.photos/seed/video-placeholder/700/420'}
//                     alt={v.title}
//                     fill
//                     sizes="(max-width: 640px) 100vw, 50vw"
//                     className="object-cover transition-transform duration-700 opacity-80 group-hover:scale-105 group-hover:opacity-60"
//                   />

//                   {/* Play Button Overlay */}
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="flex h-14 w-14 items-center justify-center rounded-full bg-saffron text-white shadow-xl shadow-saffron/40 transition-transform duration-300 group-hover:scale-115">
//                       <PlayCircle size={28} className="ml-0.5" />
//                     </div>
//                   </div>

//                   {/* Video Details */}
//                   <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink via-ink/80 to-transparent p-4">
//                     <p className="text-xs font-bold text-white line-clamp-1">{v.title}</p>
//                     <span className="rounded-md bg-white/20 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white">
//                       {v.duration}
//                     </span>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         )}

//       </div>

//       <VideoLightbox
//         open={!!activeVideo}
//         onClose={() => setActiveVideo(null)}
//         videoUrl={activeVideo?.videoUrl}
//         title={activeVideo?.title}
//       />
//     </section>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayCircle,
  Maximize2,
  Camera,
  Video,
  Sparkles,
  MapPin,
} from "lucide-react";
import VideoLightbox from "./VideoLightbox";
import ImageLightbox from "./ImageLightbox";
import InlineContentFilter, {
  defaultFilterValue,
  isFilterActive,
  matchesFilter,
} from "./InlineContentFilter";
import { useContentFilter } from "@/context/FilterContext";

export default function GallerySection({ full = false }) {
  const [activeTab, setActiveTab] = useState("all");
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [galleryVideos, setGalleryVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [zoomPhoto, setZoomPhoto] = useState(null);
  const [locationFilter, setLocationFilter] = useState(defaultFilterValue);
  const isActive = isFilterActive(locationFilter);

  useEffect(() => {
    let alive = true;
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        if (!alive || !Array.isArray(data)) return;
        setGalleryPhotos(data.filter((g) => g.type === "photo"));
        setGalleryVideos(data.filter((g) => g.type === "video"));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Filter logic (if category exists in photo objects, else fallback to slice)
  const categories = ["all", "Youth", "Rallies", "Meetings", "Padyatra"];

  const locationFilteredPhotos = isActive
    ? galleryPhotos.filter((p) => matchesFilter(p, locationFilter))
    : galleryPhotos;
  const locationFilteredVideos = isActive
    ? galleryVideos.filter((v) => matchesFilter(v, locationFilter))
    : galleryVideos;

  const displayPhotos = full
    ? locationFilteredPhotos
    : locationFilteredPhotos.slice(0, 8); // Showing 8 uniform small cards in hero mode

  const filteredPhotos =
    activeTab === "all"
      ? displayPhotos
      : displayPhotos.filter(
          (p) => p.category?.toLowerCase() === activeTab.toLowerCase(),
        );

  return (
    <section className="bg-ivory py-20 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-ink/10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-banyan/20 bg-banyan/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-banyan">
              <Camera size={14} />
              Ground Coverage
            </span>
            <h2
              id="photos"
              className="scroll-mt-24 mt-4 flex flex-wrap items-center gap-3 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl"
            >
              Campaign Photo Gallery
              <InlineContentFilter
                type="gallery"
                value={locationFilter}
                onChange={setLocationFilter}
              />
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Real moments from our booth-level padyatras and ground meetings.
            </p>
          </div>

          {!full && (
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-ivory transition-all hover:bg-saffron hover:shadow-lg active:scale-95"
            >
              View Full Gallery
              <Sparkles
                size={14}
                className="transition-transform group-hover:rotate-12"
              />
            </Link>
          )}
        </div>

        {/* Category Filters (Only in Full view or optional) */}
        {full && (
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === cat
                    ? "bg-saffron text-white shadow-md shadow-saffron/20"
                    : "bg-white text-ink-soft hover:bg-ink/5 hover:text-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {isActive && filteredPhotos.length === 0 && (
          <p className="mt-10 text-center text-sm text-ink-soft">
            No gallery items match the selected filter.
          </p>
        )}

        {/* UNIFORM PHOTO GRID (4 cols on desktop, 3 on tablet, 2 on mobile) */}
        <motion.div
          layout
          className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          <AnimatePresence>
            {filteredPhotos.map((p, i) => (
              <motion.div
                layout
                key={p.id || p.src || i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                onClick={() => setZoomPhoto(p)}
                className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl bg-black/5 shadow-sm border border-ink/5"
              >
                {/* Image with object-cover for perfect alignment */}
                <Image
                  src={p.src}
                  alt={p.caption || "Campaign Moment"}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Zoom icon - always visible so it works on touch screens too */}
                <button
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setZoomPhoto(p);
                  }}
                  aria-label="View larger image"
                  className="zoom-btn absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
                >
                  <Maximize2 size={15} />
                </button>

                {/* Subtle Glassmorphic Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100 flex flex-col justify-between p-4">
                  <div />

                  <div>
                    {p.location && (
                      <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-saffron mb-1">
                        <MapPin size={10} />
                        {p.location}
                      </p>
                    )}
                    <p className="text-xs font-semibold leading-tight text-white line-clamp-2">
                      {p.caption}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* UNIFORM VIDEO GALLERY (If full view is enabled) */}
        {/* VIDEO GALLERY */}
        <div className="mt-20 pt-16 border-t border-ink/10">
          <div className="flex items-center gap-2 text-saffron font-bold text-xs uppercase tracking-wider">
            <Video size={16} />
            Video Highlights
          </div>

          <h2
            id="videos"
            className="scroll-mt-24 mt-2 font-display text-3xl font-black text-ink sm:text-4xl"
          >
            Campaign Speeches & Coverage
          </h2>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(full
              ? locationFilteredVideos
              : locationFilteredVideos.slice(0, 3)
            ).map((v, i) => (
              <motion.div
                key={v.id || v.title || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onClick={() => v.videoUrl && setActiveVideo(v)}
                className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-ink shadow-md cursor-pointer"
              >
                <Image
                  src={v.thumb || "/images/video-placeholder.jpg"}
                  alt={v.title || "Campaign video"}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 opacity-80 group-hover:scale-105 group-hover:opacity-60"
                />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-saffron text-white shadow-xl shadow-saffron/40 transition-transform duration-300 group-hover:scale-110">
                    <PlayCircle size={28} className="ml-0.5" />
                  </div>
                </div>

                {/* Video Details */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink via-ink/80 to-transparent p-4">
                  <p className="text-xs font-bold text-white line-clamp-1">
                    {v.title}
                  </p>

                  {v.duration && (
                    <span className="rounded-md bg-white/20 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white">
                      {v.duration}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {!full && locationFilteredVideos.length > 3 && (
            <div className="mt-8 flex justify-center">
              <Link
                href="/gallery#videos"
                className="rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-ivory transition hover:bg-saffron"
              >
                View All Videos
              </Link>
            </div>
          )}
        </div>
      </div>

      <VideoLightbox
        open={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.videoUrl}
        title={activeVideo?.title}
      />

      <ImageLightbox
        open={!!zoomPhoto}
        onClose={() => setZoomPhoto(null)}
        src={zoomPhoto?.src}
        alt={zoomPhoto?.caption || "Campaign Moment"}
        caption={zoomPhoto?.caption}
      />
    </section>
  );
}
