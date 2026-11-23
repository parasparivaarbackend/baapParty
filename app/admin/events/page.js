'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Pencil, PlayCircle, Plus, Trash2 } from 'lucide-react';
import { Modal, ConfirmDialog, PageHeader, Button, EmptyState, Field, inputClass, Badge } from '@/components/admin/ui';
import MediaField from '@/components/admin/MediaField';
import LocationFields from '@/components/admin/LocationFields';
import VideoLightbox from '@/components/VideoLightbox';
import { getYouTubeThumbnail, isYouTubeUrl } from '@/lib/youtube';

const CATEGORIES = ['Rally', 'Conference'];
const emptyForm = {
  title: '',
  date: '',
  time: '',
  location: '',
  state: '',
  city: '',
  category: 'Rally',
  mediaType: 'image',
  image: '',
  videoUrl: '',
  desc: '',
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  const load = () => {
    setLoading(true);
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (ev) => {
    setEditing(ev);
    setForm({
      title: ev.title || '',
      date: ev.date || '',
      time: ev.time || '',
      location: ev.location || '',
      state: ev.state || '',
      city: ev.city || '',
      category: ev.category || 'Rally',
      mediaType: ev.mediaType || 'image',
      image: ev.image || '',
      videoUrl: ev.videoUrl || '',
      desc: ev.desc || '',
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.date) e.date = 'Date is required';
    if (!form.time.trim()) e.time = 'Time is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (form.mediaType === 'image') {
      if (!form.image.trim()) e.image = 'Image is required';
    } else if (!form.videoUrl.trim()) {
      e.videoUrl = 'A video link or file is required';
    }
    if (!form.desc.trim()) e.desc = 'Description is required';
    return e;
  };

  const handleSave = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    try {
      const payload = { ...form };
      if (payload.mediaType === 'video' && !payload.image.trim() && isYouTubeUrl(payload.videoUrl)) {
        payload.image = getYouTubeThumbnail(payload.videoUrl) || '';
      }
      const url = editing ? `/api/events/${editing.id}` : '/api/events';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed');
      setModalOpen(false);
      load();
    } catch {
      setErrors((e) => ({ ...e, form: 'Something went wrong. Please try again.' }));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/events/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Events"
        subtitle="Manage rallies and conferences — changes go live on the Events page and home page immediately."
        action={
          <Button onClick={openAdd}>
            <Plus size={16} /> Add Event
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-ink-soft">Loading...</p>
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No events yet"
          description="Add your first rally or conference to see it live on the site."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/8 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/8 bg-ivory/60 text-xs font-bold uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3.5">Image</th>
                <th className="px-5 py-3.5">Event</th>
                <th className="px-5 py-3.5">Date &amp; Time</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-ivory/40">
                  <td className="px-5 py-4">
                    {ev.image ? (
                      <button
                        type="button"
                        onClick={() => ev.mediaType === 'video' && ev.videoUrl && setPreviewItem(ev)}
                        className={`relative block h-12 w-16 overflow-hidden rounded-lg border border-ink/8 ${
                          ev.mediaType === 'video' && ev.videoUrl ? 'cursor-pointer' : 'cursor-default'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ev.image} alt={ev.title} className="h-full w-full object-cover" />
                        {ev.mediaType === 'video' && (
                          <span className="absolute inset-0 flex items-center justify-center bg-ink/25">
                            <PlayCircle size={16} className="text-white" />
                          </span>
                        )}
                      </button>
                    ) : (
                      <span className="flex h-12 w-16 items-center justify-center rounded-lg border border-dashed border-ink/15 text-[10px] text-ink-soft/60">
                        No image
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-semibold text-ink">{ev.title}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-ink-soft">
                    {ev.date} · {ev.time}
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={ev.category === 'Rally' ? 'saffron' : 'banyan'}>{ev.category}</Badge>
                  </td>
                  <td className="px-5 py-4 text-ink-soft">
                    {ev.location}
                    {(ev.state || ev.city) && (
                      <span className="mt-1 block text-[11px] text-ink-soft/70">
                        {[ev.city, ev.state].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(ev)}
                        className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(ev)}
                        className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-saffron/10 hover:text-saffron-dark"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Event' : 'Add Event'} maxWidth="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-5">
          <Field label="Title" error={errors.title}>
            <input
              className={inputClass(errors.title)}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Jan Sabha — Lucknow Maidan"
            />
          </Field>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Date" error={errors.date}>
              <input
                type="date"
                className={inputClass(errors.date)}
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </Field>
            <Field label="Time" error={errors.time}>
              <input
                className={inputClass(errors.time)}
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                placeholder="4:00 PM"
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Location" error={errors.location}>
              <input
                className={inputClass(errors.location)}
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Ambedkar Maidan, Lucknow"
              />
            </Field>
            <Field label="Category">
              <select
                className={inputClass()}
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <LocationFields
            state={form.state}
            city={form.city}
            onChange={({ state, city }) => setForm((f) => ({ ...f, state, city }))}
          />
          <MediaField
            mediaType={form.mediaType}
            onMediaTypeChange={(mediaType) => setForm((f) => ({ ...f, mediaType }))}
            image={form.image}
            onImageChange={(image) => setForm((f) => ({ ...f, image }))}
            videoUrl={form.videoUrl}
            onVideoUrlChange={(videoUrl) => setForm((f) => ({ ...f, videoUrl }))}
            folder="events"
            errors={errors}
          />
          <Field label="Description" error={errors.desc}>
            <textarea
              rows={3}
              className={inputClass(errors.desc)}
              value={form.desc}
              onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
            />
          </Field>
          {errors.form && <p className="text-sm font-semibold text-saffron-dark">{errors.form}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Event'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this event?"
        description={deleteTarget ? `"${deleteTarget.title}" will be removed from the site immediately.` : ''}
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
