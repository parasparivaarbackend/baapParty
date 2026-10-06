'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Minus, Plus, RotateCcw, X } from 'lucide-react';

const MIN = 1;
const MAX = 4;
const STEP = 0.5;

// Full-screen image viewer with zoom in / zoom out / reset / close.
// Rendered through a portal so parent transforms (framer-motion, overflow-hidden)
// can never clip it.
export default function ImageLightbox({ open, src, alt = '', caption, onClose }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const drag = useRef(null);

  useEffect(() => setMounted(true), []);

  // reset every time a new image opens
  useEffect(() => {
    if (open) {
      setScale(1);
      setPos({ x: 0, y: 0 });
    }
  }, [open, src]);

  const zoomTo = useCallback((next) => {
    const s = Math.min(MAX, Math.max(MIN, next));
    setScale(s);
    if (s === 1) setPos({ x: 0, y: 0 });
  }, []);

  // Esc / + / - keys, and lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') zoomTo(scale + STEP);
      if (e.key === '-') zoomTo(scale - STEP);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, scale, zoomTo]);

  if (!open || !src || !mounted) return null;

  const onWheel = (e) => zoomTo(scale + (e.deltaY < 0 ? STEP : -STEP));

  const onPointerDown = (e) => {
    if (scale === 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    setPos({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y });
  };
  const onPointerUp = () => (drag.current = null);

  const btn =
    'flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 disabled:opacity-30 disabled:hover:bg-white/10';

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* toolbar */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <button type="button" className={btn} onClick={() => zoomTo(scale - STEP)} disabled={scale <= MIN} aria-label="Zoom out">
            <Minus size={18} />
          </button>
          <span className="w-12 text-center text-xs font-bold text-white/80">{Math.round(scale * 100)}%</span>
          <button type="button" className={btn} onClick={() => zoomTo(scale + STEP)} disabled={scale >= MAX} aria-label="Zoom in">
            <Plus size={18} />
          </button>
          <button type="button" className={btn} onClick={() => zoomTo(1)} disabled={scale === 1} aria-label="Reset zoom">
            <RotateCcw size={16} />
          </button>
        </div>
        <button type="button" className={btn} onClick={onClose} aria-label="Close image">
          <X size={22} />
        </button>
      </div>

      {/* image */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 pb-4"
        onWheel={onWheel}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={() => zoomTo(scale === 1 ? 2 : 1)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            cursor: scale > 1 ? 'grab' : 'zoom-in',
            touchAction: 'none',
          }}
          className="max-h-full max-w-full select-none rounded-lg object-contain shadow-2xl transition-transform duration-150"
        />
      </div>

      {caption && (
        <p className="px-4 pb-4 text-center text-sm font-semibold text-white/80" onClick={(e) => e.stopPropagation()}>
          {caption}
        </p>
      )}
    </div>,
    document.body
  );
}
