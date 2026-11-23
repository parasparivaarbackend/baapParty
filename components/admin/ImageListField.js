'use client';

import { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Link2, Loader2, Trash2, Upload } from 'lucide-react';
import { Field, inputClass } from './ui';

/**
 * Several images for one record. Each can be uploaded (stored on Cloudinary through /api/upload,
 * same as Events / Blog / Gallery) or added by pasting a link. Order = display order.
 */
export default function ImageListField({ label = 'Images', images = [], onChange, folder = 'chapters', error, hint }) {
  const [uploading, setUploading] = useState(false);
  const [link, setLink] = useState('');
  const [msg, setMsg] = useState('');
  const fileRef = useRef(null);

  const upload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    setMsg('');
    const added = [];
    for (const file of files) {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', folder);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        added.push(data.url);
      } catch (e) {
        setMsg(`${file.name}: ${e.message}`);
      }
    }
    if (added.length) onChange([...images, ...added]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const addLink = () => {
    const v = link.trim();
    if (!v) return;
    onChange([...images, v]);
    setLink('');
  };

  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <Field label={label} error={error || msg} hint={hint}>
      {images.length > 0 && (
        <ul className="mb-3 space-y-2">
          {images.map((src, i) => (
            <li key={`${src}-${i}`} className="flex items-center gap-3 rounded-xl border border-ink/10 bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-14 w-20 shrink-0 rounded-lg border border-ink/8 object-cover" />
              <span className="min-w-0 flex-1 truncate text-xs text-ink-soft">
                <b className="text-ink">#{i + 1}</b> {src}
              </span>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-lg p-1.5 text-ink-soft hover:bg-ink/5 disabled:opacity-30" aria-label="Move up">
                <ArrowUp size={15} />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="rounded-lg p-1.5 text-ink-soft hover:bg-ink/5 disabled:opacity-30" aria-label="Move down">
                <ArrowDown size={15} />
              </button>
              <button type="button" onClick={() => onChange(images.filter((_, k) => k !== i))} className="rounded-lg p-1.5 text-ink-soft hover:bg-saffron/10 hover:text-saffron-dark" aria-label="Remove">
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/15 px-4 py-2.5 text-sm text-ink-soft hover:border-saffron sm:w-56">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? 'Uploading...' : 'Upload image(s)'}
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" disabled={uploading} onChange={(e) => upload([...(e.target.files || [])])} />
        </label>
        <div className="flex flex-1 gap-2">
          <input
            className={inputClass()}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
            placeholder="…or paste an image link (https://...)"
          />
          <button type="button" onClick={addLink} className="flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-ink/10 px-3 text-sm font-bold text-ink-soft hover:border-saffron hover:text-saffron">
            <Link2 size={15} /> Add
          </button>
        </div>
      </div>
    </Field>
  );
}
