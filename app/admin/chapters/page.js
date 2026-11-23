'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, BookOpen, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import { Modal, ConfirmDialog, PageHeader, Button, EmptyState, Field, inputClass, Badge } from '@/components/admin/ui';
import ImageListField from '@/components/admin/ImageListField';
import { blocksToText, textToBlocks } from '@/lib/chapterUtils';

const ICONS = [
  'apple', 'flame', 'vote', 'shield', 'wrench', 'sparkles', 'plane', 'lock', 'user-check',
  'pill', 'eye', 'megaphone', 'gavel', 'heart-pulse', 'wheat', 'hand-helping', 'ban', 'equal',
];

const emptyForm = {
  title: '', slug: '', order: '', icon: 'sparkles', published: true,
  summary: '', contentText: '', resolve: '', closingText: '', images: [],
  hiTitle: '', hiSummary: '', hiContentText: '', hiResolve: '', hiClosingText: '',
};

const CONTENT_HINT =
  'One point per line. Start a line with "- " to make it a sub-point under the line above (e.g. after a line ending with ":").';

export default function AdminChaptersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [tab, setTab] = useState('en');

  const load = () => {
    setLoading(true);
    fetch('/api/chapters?all=1')
      .then(async (r) => {
        const data = await r.json().catch(() => null);
        if (!r.ok) throw new Error(data?.error || 'Could not load chapters');
        setItems(Array.isArray(data) ? data : []);
        setLoadError('');
      })
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setTab('en');
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      title: c.title || '', slug: c.slug || '', order: c.order ?? '', icon: c.icon || 'sparkles',
      published: c.published !== false,
      summary: c.summary || '',
      contentText: blocksToText(c.content),
      resolve: c.resolve || '',
      closingText: (c.closing || []).join('\n'),
      images: c.images || [],
      hiTitle: c.hi?.title || '',
      hiSummary: c.hi?.summary || '',
      hiContentText: blocksToText(c.hi?.content),
      hiResolve: c.hi?.resolve || '',
      hiClosingText: (c.hi?.closing || []).join('\n'),
    });
    setErrors({});
    setTab('en');
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!textToBlocks(form.contentText).length) e.contentText = 'Add at least one content point';
    if (!form.images.length) e.images = 'Add at least one image';
    return e;
  };

  const handleSave = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      setTab('en');
      return;
    }
    setSaving(true);
    try {
      const lines = (t) => t.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
      const payload = {
        title: form.title,
        slug: form.slug || undefined,
        order: form.order === '' ? undefined : Number(form.order),
        icon: form.icon,
        published: form.published,
        summary: form.summary,
        content: textToBlocks(form.contentText),
        resolve: form.resolve,
        closing: lines(form.closingText),
        images: form.images,
        image: form.images[0],
        hi: {
          title: form.hiTitle,
          summary: form.hiSummary,
          content: textToBlocks(form.hiContentText),
          resolve: form.hiResolve,
          closing: lines(form.hiClosingText),
        },
      };
      const res = await fetch(editing ? `/api/chapters/${editing.id}` : '/api/chapters', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed');
      setModalOpen(false);
      load();
    } catch (e) {
      setErrors((x) => ({ ...x, form: e.message || 'Something went wrong. Please try again.' }));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/chapters/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  // Swap the display order of two neighbouring chapters.
  const move = async (i, d) => {
    const a = items[i];
    const b = items[i + d];
    if (!a || !b) return;
    const orderA = a.order ?? i + 1;
    const orderB = b.order ?? i + d + 1;
    const [oa, ob] = orderA === orderB ? [orderB + d, orderA] : [orderB, orderA];
    await Promise.all([
      fetch(`/api/chapters/${a.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: oa }) }),
      fetch(`/api/chapters/${b.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: ob }) }),
    ]);
    load();
  };

  const tabBtn = (key, label) => (
    <button
      type="button"
      onClick={() => setTab(key)}
      className={`flex-1 rounded-xl border-2 py-2 text-sm font-bold transition-colors ${
        tab === key ? 'border-saffron bg-saffron text-white' : 'border-ink/10 text-ink-soft hover:border-saffron hover:text-saffron'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <PageHeader
        title="Chapters"
        subtitle="Manage the manifesto chapters — changes go live on the Manifesto page, chapter pages and home page immediately."
        action={
          <Button onClick={openAdd}>
            <Plus size={16} /> Add Chapter
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-ink-soft">Loading...</p>
      ) : loadError ? (
        <p className="text-sm font-semibold text-saffron-dark">{loadError}</p>
      ) : items.length === 0 ? (
        <EmptyState icon={BookOpen} title="No chapters yet" description="Add your first chapter to publish it on the Manifesto page." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/8 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/8 bg-ivory/60 text-xs font-bold uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3.5">#</th>
                <th className="px-5 py-3.5">Image</th>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Hindi</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {items.map((c, i) => (
                <tr key={c.id} className="hover:bg-ivory/40">
                  <td className="px-5 py-4 font-bold text-ink-soft">{c.number}</td>
                  <td className="px-5 py-4">
                    {c.images?.[0] || c.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.images?.[0] || c.image} alt="" className="h-12 w-16 rounded-lg border border-ink/8 object-cover" />
                    ) : (
                      <span className="flex h-12 w-16 items-center justify-center rounded-lg border border-dashed border-ink/15 text-[10px] text-ink-soft/60">No image</span>
                    )}
                  </td>
                  <td className="max-w-md px-5 py-4 font-semibold text-ink">{c.title}</td>
                  <td className="px-5 py-4">
                    <Badge tone={c.published === false ? 'gray' : 'banyan'}>{c.published === false ? 'Draft' : 'Published'}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={c.hi?.title && c.hi?.content?.length ? 'banyan' : 'saffron'}>
                      {c.hi?.title && c.hi?.content?.length ? 'Added' : 'Missing'}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="rounded-lg p-2 text-ink-soft hover:bg-ink/5 hover:text-ink disabled:opacity-30">
                        <ArrowUp size={16} />
                      </button>
                      <button onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down" className="rounded-lg p-2 text-ink-soft hover:bg-ink/5 hover:text-ink disabled:opacity-30">
                        <ArrowDown size={16} />
                      </button>
                      <Link href={`/manifesto/${c.slug}`} target="_blank" aria-label="View on site" className="rounded-lg p-2 text-ink-soft hover:bg-ink/5 hover:text-ink">
                        <ExternalLink size={16} />
                      </Link>
                      <button onClick={() => openEdit(c)} aria-label="Edit" className="rounded-lg p-2 text-ink-soft hover:bg-ink/5 hover:text-ink">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteTarget(c)} aria-label="Delete" className="rounded-lg p-2 text-ink-soft hover:bg-saffron/10 hover:text-saffron-dark">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Chapter' : 'Add Chapter'} maxWidth="max-w-3xl">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex gap-2.5">
            {tabBtn('en', 'English')}
            {tabBtn('hi', 'हिन्दी (Hindi)')}
          </div>

          {tab === 'en' ? (
            <>
              <Field label="Title" error={errors.title}>
                <input className={inputClass(errors.title)} value={form.title} onChange={set('title')} placeholder="Chapter heading" />
              </Field>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Field label="Order" hint="Position in the list (1 = first). Blank = last.">
                  <input type="number" min="1" className={inputClass()} value={form.order} onChange={set('order')} />
                </Field>
                <Field label="Icon (home page card)">
                  <select className={inputClass()} value={form.icon} onChange={set('icon')}>
                    {ICONS.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Status">
                  <select className={inputClass()} value={form.published ? '1' : '0'} onChange={(e) => setForm((f) => ({ ...f, published: e.target.value === '1' }))}>
                    <option value="1">Published</option>
                    <option value="0">Draft (hidden)</option>
                  </select>
                </Field>
              </div>
              {editing && (
                <Field label="URL slug" hint="Changing it changes the chapter's web address.">
                  <input className={inputClass()} value={form.slug} onChange={set('slug')} />
                </Field>
              )}
              <Field label="Short summary (used for search / sharing)">
                <textarea rows={2} className={inputClass()} value={form.summary} onChange={set('summary')} />
              </Field>
              <Field label="Content" error={errors.contentText} hint={CONTENT_HINT}>
                <textarea rows={10} className={inputClass(errors.contentText)} value={form.contentText} onChange={set('contentText')} placeholder={'First point\nSecond point:\n- sub point\n- another sub point'} />
              </Field>
              <ImageListField
                label="Images (shown zig-zag next to the content)"
                images={form.images}
                onChange={(images) => setForm((f) => ({ ...f, images }))}
                error={errors.images}
                hint="Uploaded to Cloudinary. The first image is also used as the share image. Content is split evenly across the images."
              />
              <Field label="Our Resolve (highlighted box)">
                <textarea rows={2} className={inputClass()} value={form.resolve} onChange={set('resolve')} />
              </Field>
              <Field label="Closing lines (optional)" hint="One per line, shown centred below the resolve box.">
                <textarea rows={2} className={inputClass()} value={form.closingText} onChange={set('closingText')} />
              </Field>
            </>
          ) : (
            <>
              <p className="rounded-xl bg-banyan/5 px-4 py-3 text-xs text-ink-soft">
                Shown when the visitor switches the site to Hindi. Any field left empty falls back to the English text.
                Keep the same order of points as the English content.
              </p>
              <Field label="शीर्षक (Title)">
                <input className={inputClass()} value={form.hiTitle} onChange={set('hiTitle')} />
              </Field>
              <Field label="सारांश (Summary)">
                <textarea rows={2} className={inputClass()} value={form.hiSummary} onChange={set('hiSummary')} />
              </Field>
              <Field label="विषय-वस्तु (Content)" hint={CONTENT_HINT}>
                <textarea rows={10} className={inputClass()} value={form.hiContentText} onChange={set('hiContentText')} />
              </Field>
              <Field label="हमारा संकल्प (Our Resolve)">
                <textarea rows={2} className={inputClass()} value={form.hiResolve} onChange={set('hiResolve')} />
              </Field>
              <Field label="समापन पंक्तियाँ (Closing lines)" hint="One per line.">
                <textarea rows={2} className={inputClass()} value={form.hiClosingText} onChange={set('hiClosingText')} />
              </Field>
            </>
          )}

          {errors.form && <p className="text-sm font-semibold text-saffron-dark">{errors.form}</p>}
          {Object.keys(errors).some((k) => k !== 'form') && tab === 'hi' && (
            <p className="text-sm font-semibold text-saffron-dark">Some required English fields need attention.</p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Chapter'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this chapter?"
        description={deleteTarget ? `"${deleteTarget.title}" will be removed from the site immediately.` : ''}
      />
    </>
  );
}
