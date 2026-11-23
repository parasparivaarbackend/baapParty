const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://bharatiyaavijitaawazparty.in';

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${base}/sitemap.xml`,
  };
}
