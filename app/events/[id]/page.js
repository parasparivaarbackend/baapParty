import ZoomableImage from '@/components/ZoomableImage';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import CtaBanner from '@/components/CtaBanner';
import { getEvent } from '@/lib/db/events';
import { getYouTubeEmbedUrl, isYouTubeUrl } from '@/lib/youtube';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

export default async function EventDetailPage({ params }) {
  const event = await getEvent(params.id);
  if (!event) return notFound();
  const isVideo = event.mediaType === 'video' && event.videoUrl;

  return (
    <>
      <PageHeader eyebrow={event.category} title={event.title} crumb="Events" />

      <section className="bg-paper py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-soft transition-colors hover:text-saffron"
          >
            <ArrowLeft size={16} /> Back to all events
          </Link>

          <div className="mt-6 overflow-hidden rounded-2xl bg-ink shadow-card">
            {isVideo ? (
              <div className="relative aspect-[16/9] w-full">
                {isYouTubeUrl(event.videoUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(event.videoUrl, false)}
                    title={event.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                ) : (
                  <video src={event.videoUrl} controls className="h-full w-full">
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ) : (
              <div className="relative aspect-[16/9] w-full">
                <ZoomableImage src={event.image} alt={event.title} fill className="object-cover" />
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-6 border-b border-ink/8 pb-8 text-sm font-semibold text-ink-soft">
            <p className="flex items-center gap-2"><Calendar size={16} className="text-banyan" /> {formatDate(event.date)}</p>
            <p className="flex items-center gap-2"><Clock size={16} className="text-banyan" /> {event.time}</p>
            <p className="flex items-center gap-2"><MapPin size={16} className="text-banyan" /> {event.location}</p>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-2xl font-bold text-ink">Details</h2>
            <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-ink-soft">
              {event.desc}
            </p>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
