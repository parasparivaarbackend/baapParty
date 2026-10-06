'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Images, PlayCircle, Plus, Trash2, Upload } from 'lucide-react';
import { Modal, ConfirmDialog, PageHeader, Button, EmptyState, Field, inputClass, Badge } from '@/components/admin/ui';
import VideoLightbox from '@/components/VideoLightbox';
import { isYouTubeUrl } from '@/lib/youtube';
import LocationFields from '@/components/admin/LocationFields';

const emptyForm = { type: 'photo', videoSource: 'upload', videoUrl: '', caption: '', location: '', state: '', city: '', category: '' };

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const fileInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const load = () => {
    setLoading(true);
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setFile(null);
    setThumbFile(null);
    setErrors({});
    setModalOpen(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (thumbInputRef.current) thumbInputRef.current.value = '';
  };

  const validate = () => {
    const e = {};
    if (form.type === 'photo') {
      if (!file) e.file = 'A photo is required';
    } else if (form.videoSource === 'youtube') {
      if (!form.videoUrl.trim()) e.videoUrl = 'A YouTube link is required';
      else if (!isYouTubeUrl(form.videoUrl.trim())) e.videoUrl = "That doesn't look like a valid YouTube link";
    } else {
      if (!file) e.file = 'A video file is required';
      if (!thumbFile) e.thumbFile = 'A thumbnail image is required for uploaded videos';
    }
    return e;
  };

  const handleSave = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    try {
      const body = new FormData();
      body.append('type', form.type);
      body.append('caption', form.caption);
      body.append('location', form.location);
      body.append('state', form.state);
      body.append('city', form.city);
      body.append('category', form.category);
      if (form.type === 'video' && form.videoSource === 'youtube') {
        body.append('videoUrl', form.videoUrl.trim());
        if (thumbFile) body.append('thumbnail', thumbFile);
      } else {
        body.append('file', file);
        if (form.type === 'video' && thumbFile) body.append('thumbnail', thumbFile);
      }

      const res = await fetch('/api/gallery', { method: 'POST', body });
      if (!res.ok) throw new Error('Failed');
      setModalOpen(false);
      load();
    } catch {
      setErrors((e) => ({ ...e, form: 'Upload failed. Please try again.' }));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/gallery/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Gallery"
        subtitle="Upload photos and videos — they appear live on the Gallery page immediately. Videos need a thumbnail image."
        action={
          <Button onClick={openAdd}>
            <Plus size={16} /> Upload
          </Button>
        } 
      />

      {loading ? (
        <p className="text-sm text-ink-soft">Loading...</p>
      ) : items.length === 0 ? (
        <EmptyState icon={Images} title="No gallery items yet" description="Upload a photo or video to see it live on the site." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => item.type === 'video' && item.videoUrl && setPreviewItem(item)}
              className={`group relative aspect-square overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-card ${
                item.type === 'video' && item.videoUrl ? 'cursor-pointer' : ''
              }`}
            >
              <Image
                src={(item.type === 'video' ? item.thumb : item.src) || 'https://picsum.photos/seed/gallery-placeholder/500/500'}
                alt={item.caption || item.title || 'Gallery item'}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
              {item.type === 'video' && (
                <span className="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors group-hover:bg-ink/35">
                  <PlayCircle size={30} className="text-white drop-shadow" />
                </span>
              )}
              <span className="absolute left-2 top-2">
                <Badge tone={item.type === 'video' ? 'banyan' : 'saffron'}>{item.type}</Badge>
              </span>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="line-clamp-2 text-xs font-semibold text-white">{item.caption || item.title || '—'}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(item);
                  }}
                  className="flex-shrink-0 rounded-full bg-white/15 p-2 text-white backdrop-blur-sm transition-colors hover:bg-saffron"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload to Gallery" maxWidth="max-w-lg">
        <form onSubmit={handleSave} className="space-y-5">
          <Field label="Type">
            <div className="flex gap-2.5">
              {['photo', 'video'].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={`flex-1 rounded-xl border-2 py-2.5 text-sm font-bold capitalize transition-colors ${
                    form.type === t ? 'border-saffron bg-saffron text-white' : 'border-ink/10 text-ink-soft hover:border-saffron hover:text-saffron'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>

          {form.type === 'video' && (
            <Field label="Video Source">
              <div className="flex gap-2.5">
                {[
                  { key: 'upload', label: 'Upload File' },
                  { key: 'youtube', label: 'YouTube Link' },
                ].map((s) => (
                  <button
                    type="button"
                    key={s.key}
                    onClick={() => {
                      setForm((f) => ({ ...f, videoSource: s.key }));
                      setErrors({});
                    }}
                    className={`flex-1 rounded-xl border-2 py-2.5 text-sm font-bold transition-colors ${
                      form.videoSource === s.key
                        ? 'border-saffron bg-saffron text-white'
                        : 'border-ink/10 text-ink-soft hover:border-saffron hover:text-saffron'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </Field>
          )}

          {form.type === 'photo' || form.videoSource === 'upload' ? (
            <Field label={form.type === 'video' ? 'Video File' : 'Photo File'} error={errors.file}>
              <label className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 text-sm ${errors.file ? 'border-saffron-dark' : 'border-ink/15 hover:border-saffron'}`}>
                <Upload size={16} className="text-ink-soft" />
                <span className="text-ink-soft">{file ? file.name : `Choose a ${form.type} file...`}</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={form.type === 'video' ? 'video/*' : 'image/*'}
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            </Field>
          ) : (
            <Field label="YouTube Link" error={errors.videoUrl} hint="Paste any youtube.com or youtu.be video link.">
              <input
                className={inputClass(errors.videoUrl)}
                value={form.videoUrl}
                onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </Field>
          )}

          {form.type === 'video' && (
            <Field
              label="Thumbnail Image"
              error={errors.thumbFile}
              hint={
                form.videoSource === 'youtube'
                  ? "Optional — we'll use the YouTube thumbnail automatically if you skip this."
                  : "Shown as the video's preview image on the site."
              }
            >
              <label className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 text-sm ${errors.thumbFile ? 'border-saffron-dark' : 'border-ink/15 hover:border-saffron'}`}>
                <Upload size={16} className="text-ink-soft" />
                <span className="text-ink-soft">{thumbFile ? thumbFile.name : 'Choose a thumbnail image...'}</span>
                <input
                  ref={thumbInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                />
              </label>
            </Field>
          )}

          <Field label={form.type === 'video' ? 'Title' : 'Caption'}>
            <input
              className={inputClass()}
              value={form.caption}
              onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
              placeholder={form.type === 'video' ? 'Manifesto 2026 — Full Announcement' : 'Booth-Level Worker Convention'}
            />
          </Field>

          {form.type === 'photo' && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Location">
                <input
                  className={inputClass()}
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="Central Constituency"
                />
              </Field>
              <Field label="Category">
                <input
                  className={inputClass()}
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="Rallies / Padyatra / Youth / Meetings"
                />
              </Field>
            </div>
          )}

          {form.type === 'photo' && (
            <LocationFields
              state={form.state}
              city={form.city}
              onChange={({ state, city }) => setForm((f) => ({ ...f, state, city }))}
            />
          )}

          {errors.form && <p className="text-sm font-semibold text-saffron-dark">{errors.form}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this item?"
        description="It will be removed from the site's gallery immediately."
      />

      <VideoLightbox
        open={!!previewItem}
        onClose={() => setPreviewItem(null)}
        videoUrl={previewItem?.videoUrl}
        title={previewItem?.title}
      />
    </>
  );
}
