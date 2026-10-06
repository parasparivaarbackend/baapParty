'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { getYouTubeEmbedUrl, isYouTubeUrl } from '@/lib/youtube';

// Plays a gallery video full-screen, whether it's a locally uploaded file
// (plain <video>) or a YouTube link (embedded <iframe>).
export default function VideoLightbox({ open, onClose, videoUrl, title }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !videoUrl) return null;

  const youtube = isYouTubeUrl(videoUrl);
  const embedUrl = youtube ? getYouTubeEmbedUrl(videoUrl) : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
        aria-label="Close video"
      >
        <X size={22} />
      </button>

      <div
        className="aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {youtube ? (
          embedUrl ? (
            <iframe
              src={embedUrl}
              title={title || 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <p className="flex h-full items-center justify-center text-sm text-white/70">
              Couldn&apos;t read this YouTube link.
            </p>
          )
        ) : (
          <video src={videoUrl} controls autoPlay className="h-full w-full">
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}
