'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Maximize2 } from 'lucide-react';
import ImageLightbox from './ImageLightbox';

// Drop-in replacement for <Image fill ... /> inside a `relative` container.
// Adds a zoom icon (always visible, works on touch) and opens the viewer when
// the icon OR the image itself is tapped.
export default function ZoomableImage({ src, alt = '', caption, buttonClassName = '', zoomable = true, ...imageProps }) {
  const [open, setOpen] = useState(false);
  const { className = '', ...rest } = imageProps;

  // e.g. video thumbnails: plain image, no zoom icon
  if (!zoomable) return <Image src={src} alt={alt} className={className} {...rest} />;

  return (
    <>
      <Image
        src={src}
        alt={alt}
        className={`${className} cursor-zoom-in`}
        onClick={() => setOpen(true)}
        {...rest}
      />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label="View larger image"
        className={`zoom-btn absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm ${buttonClassName}`}
      >
        <Maximize2 size={15} />
      </button>
      <ImageLightbox open={open} src={typeof src === 'string' ? src : src?.src} alt={alt} caption={caption} onClose={() => setOpen(false)} />
    </>
  );
}
