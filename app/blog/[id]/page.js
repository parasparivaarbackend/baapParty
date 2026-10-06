import ZoomableImage from '@/components/ZoomableImage';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import CtaBanner from '@/components/CtaBanner';
import { getBlogPost } from '@/lib/db/blog';
import { getYouTubeEmbedUrl, isYouTubeUrl } from '@/lib/youtube';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

export default async function BlogDetailPage({ params }) {
  const post = await getBlogPost(params.id);
  if (!post) return notFound();
  const isVideo = post.mediaType === 'video' && post.videoUrl;

  return (
    <>
      <PageHeader eyebrow={post.category} title={post.title} crumb="Blog" />

      <section className="bg-paper py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-soft transition-colors hover:text-saffron"
          >
            <ArrowLeft size={16} /> Back to all posts
          </Link>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
            {formatDate(post.date)} · {post.author}
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl bg-ink shadow-card">
            {isVideo ? (
              <div className="relative aspect-[16/9] w-full">
                {isYouTubeUrl(post.videoUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(post.videoUrl, false)}
                    title={post.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                ) : (
                  <video src={post.videoUrl} controls className="h-full w-full">
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ) : (
              <div className="relative aspect-[16/9] w-full">
                <ZoomableImage src={post.image} alt={post.title} fill className="object-cover" />
              </div>
            )}
          </div>

          <article className="prose prose-neutral mt-8 max-w-none whitespace-pre-line text-base leading-relaxed text-ink-soft">
            {post.content || post.excerpt}
          </article>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
