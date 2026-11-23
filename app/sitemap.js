import { getPublicChapters } from '@/lib/db/chapters';

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://bharatiyaavijitaawazparty.in';

export default async function sitemap() {
  const pages = ['', '/manifesto', '/about', '/events', '/blog', '/gallery', '/volunteer', '/donate', '/contact'];
  const chapters = await getPublicChapters();
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly', priority: p === '' ? 1 : 0.7 })),
    ...chapters.map((c) => ({ url: `${base}/manifesto/${c.slug}`, changeFrequency: 'monthly', priority: 0.8 })),
  ];
}
