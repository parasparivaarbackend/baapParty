'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { Modal, ConfirmDialog, PageHeader, EmptyState, Badge, Button, Field, inputClass } from '@/components/admin/ui';
import { INDIAN_STATES } from '@/lib/locations';

const blank = { wing: 'youth', state: '', district: '', name: '', designation: '', phone: '', email: '', photo: '', facebook: '', instagram: '', twitter: '', showContact: false, isActive: true, order: 100 };

export default function AdminTeamsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wing, setWing] = useState('');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null); // null | {id?, ...fields}
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [del, setDel] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = () =>
    fetch('/api/teams').then((r) => r.json()).then((d) => setItems(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((m) => (!wing || m.wing === wing) && (!s || `${m.name} ${m.district} ${m.state} ${m.designation}`.toLowerCase().includes(s)));
  }, [items, wing, q]);

  const set = (k) => (e) => setEditing((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const save = async () => {
    setSaving(true); setError('');
    const { id, ...payload } = editing;
    const res = await fetch(id ? `/api/teams/${id}` : '/api/teams', { method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) return setError(data.error || 'Could not save');
    setEditing(null); load();
  };

  const uploadPhoto = async (file) => {
    if (!file) return;
    setUploading(true); setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', 'teams');
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Photo upload failed');
      setEditing((f) => ({ ...f, photo: data.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    await fetch(`/api/teams/${del.id}`, { method: 'DELETE' });
    setDel(null); load();
  };

  return (
    <>
      <PageHeader
        title="District Teams"
        subtitle="People shown on the public Youth / Women Wing district team pages (with photo and social links)"
        action={<Button type="button" onClick={() => { setEditing({ ...blank }); setError(''); }}><Plus size={16} /> Add member</Button>}
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, district, designation…" className={`${inputClass()} max-w-xs`} />
        <select value={wing} onChange={(e) => setWing(e.target.value)} className={`${inputClass()} w-auto`}>
          <option value="">Both wings</option><option value="youth">Youth</option><option value="women">Women</option>
        </select>
      </div>

      {loading ? <p className="text-sm text-ink-soft">Loading…</p> : rows.length === 0 ? (
        <EmptyState icon={Users} title="No team members yet" description="Add district presidents, conveners and coordinators; they appear on /youth/teams and /women/teams." />
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-ink/8 text-xs uppercase tracking-wide text-ink-soft">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Designation</th><th className="px-4 py-3">Wing</th><th className="px-4 py-3">District</th><th className="px-4 py-3">Status</th><th className="px-4 py-3" /></tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id} className="border-b border-ink/5">
                  <td className="px-4 py-3 font-semibold text-ink">
                    <span className="flex items-center gap-3">
                      {m.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.photo} alt="" className="h-8 w-8 rounded-full bg-chakra object-cover object-top" />
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/5 text-[10px] text-ink-soft">{(m.name || '?')[0]}</span>
                      )}
                      {m.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">{m.designation}</td>
                  <td className="px-4 py-3 capitalize">{m.wing}</td>
                  <td className="px-4 py-3">{m.district}, {m.state}</td>
                  <td className="px-4 py-3"><Badge tone={m.isActive ? 'banyan' : 'gray'}>{m.isActive ? 'Visible' : 'Hidden'}</Badge></td>
                  <td className="px-4 py-3">
                    <span className="flex justify-end gap-1">
                      <button type="button" aria-label="Edit" onClick={() => { setEditing({ ...blank, ...m }); setError(''); }} className="rounded-full p-2 text-ink-soft hover:bg-ink/5 hover:text-ink"><Pencil size={15} /></button>
                      <button type="button" aria-label="Delete" onClick={() => setDel(m)} className="rounded-full p-2 text-ink-soft hover:bg-ink/5 hover:text-saffron-dark"><Trash2 size={15} /></button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit member' : 'Add member'}>
        {editing && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Wing"><select value={editing.wing} onChange={set('wing')} className={inputClass()}><option value="youth">Youth Wing</option><option value="women">Women Wing</option></select></Field>
              <Field label="State"><select value={editing.state} onChange={set('state')} className={inputClass()}><option value="">Select</option>{INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field label="District"><input value={editing.district} onChange={set('district')} className={inputClass()} /></Field>
              <Field label="Name"><input value={editing.name} onChange={set('name')} className={inputClass()} /></Field>
              <Field label="Designation" hint="e.g. District President, Convener"><input value={editing.designation} onChange={set('designation')} className={inputClass()} /></Field>
              <Field label="Display order" hint="Lower numbers appear first"><input type="number" value={editing.order} onChange={set('order')} className={inputClass()} /></Field>
              <Field label="Mobile (optional)"><input value={editing.phone || ''} onChange={set('phone')} className={inputClass()} /></Field>
              <Field label="Email (optional)"><input value={editing.email || ''} onChange={set('email')} className={inputClass()} /></Field>
            </div>
            <Field label="Photo (optional)" hint="JPG / PNG / WEBP, up to 10 MB. A square or portrait photo works best.">
              <div className="flex items-center gap-4">
                {editing.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={editing.photo} alt="" className="h-20 w-20 rounded-full bg-chakra object-cover object-top" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink/5 text-xs text-ink-soft">No photo</div>
                )}
                <div className="flex flex-col gap-2 text-sm">
                  <label className="cursor-pointer rounded-xl border-2 border-dashed border-ink/15 px-4 py-2 font-semibold hover:border-saffron">
                    {uploading ? 'Uploading…' : editing.photo ? 'Change photo' : 'Upload photo'}
                    <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => { uploadPhoto(e.target.files?.[0]); e.target.value = ''; }} />
                  </label>
                  {editing.photo && <button type="button" onClick={() => setEditing((f) => ({ ...f, photo: '' }))} className="text-left text-xs font-semibold text-saffron-dark hover:underline">Remove photo</button>}
                </div>
              </div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Facebook (optional)" hint="Profile link"><input value={editing.facebook || ''} onChange={set('facebook')} placeholder="https://facebook.com/…" className={inputClass()} /></Field>
              <Field label="Instagram (optional)" hint="Link or @username"><input value={editing.instagram || ''} onChange={set('instagram')} placeholder="@username" className={inputClass()} /></Field>
              <Field label="X / Twitter (optional)" hint="Link or @username"><input value={editing.twitter || ''} onChange={set('twitter')} placeholder="@username" className={inputClass()} /></Field>
            </div>
            <label className="flex items-start gap-2 text-sm text-ink"><input type="checkbox" checked={!!editing.showContact} onChange={set('showContact')} className="mt-1 accent-saffron" /> Show this person&apos;s mobile / email publicly (only with their consent)</label>
            <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={!!editing.isActive} onChange={set('isActive')} className="accent-saffron" /> Visible on the public page</label>
            {error && <p className="text-sm font-semibold text-saffron-dark">{error}</p>}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="button" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} title="Remove this member?" description={del ? `${del.name} will be removed from the team list.` : ''} />
    </>
  );
}
