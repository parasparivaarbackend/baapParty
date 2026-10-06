'use client';

import { useEffect, useState } from 'react';
import { Newspaper, Pencil, PlayCircle, Plus, Trash2 } from 'lucide-react';
import { Modal, ConfirmDialog, PageHeader, Button, EmptyState, Field, inputClass, Badge } from '@/components/admin/ui';
import MediaField from '@/components/admin/MediaField';
import LocationFields from '@/components/admin/LocationFields';
import VideoLightbox from '@/components/VideoLightbox';
import { getYouTubeThumbnail, isYouTubeUrl } from '@/lib/youtube';

const CATEGORIES = ['Latest News', 'Press Releases'];
const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  date: '',
  category: 'Latest News',
  state: '',
  city: '',
  mediaType: 'image',
  image: '',
  videoUrl: '',
  author: '',
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
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
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
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

  const openEdit = (post) => {
    setEditing(post);
    setForm({
      title: post.title || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      date: post.date || "",
      category: post.category || "Latest News",
      state: post.state || "",
      city: post.city || "",
      mediaType: post.mediaType || 'image',
      image: post.image || "",
      videoUrl: post.videoUrl || '',
      author: post.author || "",
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.excerpt.trim()) e.excerpt = 'A short excerpt is required';
    if (!form.content.trim()) e.content = "A full Content is required";
    if (!form.date) e.date = 'Date is required';
    if (form.mediaType === 'image') {
      if (!form.image.trim()) e.image = 'Image is required';
    } else if (!form.videoUrl.trim()) {
      e.videoUrl = 'A video link or file is required';
    }
    if (!form.author.trim()) e.author = 'Author is required';
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
      const url = editing ? `/api/blog/${editing.id}` : '/api/blog';
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
      await fetch(`/api/blog/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Blog / Press"
        subtitle="Manage news and press releases — changes go live on the Blog page and home page immediately."
        action={
          <Button onClick={openAdd}>
            <Plus size={16} /> Add Post
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-ink-soft">Loading...</p>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No posts yet"
          description="Add your first news update or press release to publish it."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/8 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/8 bg-ivory/60 text-xs font-bold uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3.5">Image</th>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Author</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-ivory/40">
                  <td className="px-5 py-4">
                    {post.image ? (
                      <button
                        type="button"
                        onClick={() => post.mediaType === 'video' && post.videoUrl && setPreviewItem(post)}
                        className={`relative block h-12 w-16 overflow-hidden rounded-lg border border-ink/8 ${
                          post.mediaType === 'video' && post.videoUrl ? 'cursor-pointer' : 'cursor-default'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                        {post.mediaType === 'video' && (
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
                  <td className="max-w-xs px-5 py-4 font-semibold text-ink">
                    {post.title}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-ink-soft">
                    {post.date}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      tone={
                        post.category === "Press Releases"
                          ? "banyan"
                          : "saffron"
                      }
                    >
                      {post.category}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-ink-soft">
                    {post.author}
                    {(post.state || post.city) && (
                      <span className="mt-1 block text-[11px] text-ink-soft/70">
                        {[post.city, post.state].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(post)}
                        className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(post)}
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Post" : "Add Post"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <Field label="Title" error={errors.title}>
            <input
              className={inputClass(errors.title)}
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Why Our Employment Guarantee Is Different This Time"
            />
          </Field>
          <Field label="Excerpt" error={errors.excerpt}>
            <textarea
              rows={2}
              className={inputClass(errors.excerpt)}
              value={form.excerpt}
              onChange={(e) =>
                setForm((f) => ({ ...f, excerpt: e.target.value }))
              }
              placeholder="A short one or two sentence summary shown on the card..."
            />
          </Field>
          <Field label="Full Content" error={errors.content}>
            <textarea
              rows={4}
              className={inputClass(errors.content)}
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
              placeholder="Full content shown on the Read More page..."
            />
          </Field>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Date" error={errors.date}>
              <input
                type="date"
                className={inputClass(errors.date)}
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </Field>
            <Field label="Category">
              <select
                className={inputClass()}
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Author" error={errors.author}>
              <input
                className={inputClass(errors.author)}
                value={form.author}
                onChange={(e) =>
                  setForm((f) => ({ ...f, author: e.target.value }))
                }
                placeholder="Press Cell"
              />
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
            folder="blog"
            errors={errors}
          />
          {errors.form && (
            <p className="text-sm font-semibold text-saffron-dark">
              {errors.form}
            </p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : editing ? "Save Changes" : "Add Post"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this post?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will be removed from the site immediately.`
            : ""
        }
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
