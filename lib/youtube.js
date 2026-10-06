// lib/youtube.js
//
// Small shared helpers for detecting YouTube links and turning them into
// thumbnail / embeddable URLs. Used by both the public Gallery section and
// the admin Gallery page so a video can be "uploaded" either as a local
// file OR simply pasted in as a YouTube link.

const YT_PATTERNS = [
  /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
  /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
];

export function getYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  for (const pattern of YT_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function isYouTubeUrl(url) {
  return !!getYouTubeId(url);
}

export function getYouTubeThumbnail(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export function getYouTubeEmbedUrl(url, autoplay = true) {
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?${autoplay ? 'autoplay=1&' : ''}rel=0`;
}
