'use client';

import { useEffect, useState } from 'react';
import { KeyRound, Trash2, UserPlus, ShieldCheck } from 'lucide-react';
import { PageHeader, Button, Badge, Field, inputClass, ConfirmDialog, EmptyState } from '@/components/admin/ui';

const ROLES = [
  { id: 'women_officer', label: 'Women Wing Officer', hint: 'Sees only Women Wing grievances, including confidential ones' },
  { id: 'youth_officer', label: 'Youth Wing Officer', hint: 'Sees Youth Wing and General grievances only' },
  { id: 'content_manager', label: 'Content Manager', hint: 'Can only upload and manage Events, Blog / Press and Gallery (photos & videos)' },
  { id: 'super', label: 'Super Admin', hint: 'Full access to everything, including this page' },
];
const label = (r) => ROLES.find((x) => x.id === r)?.label || r;

export default function AdminAccessPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ username: '', password: '', role: 'women_officer' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [del, setDel] = useState(null);
  const [reset, setReset] = useState(null); // account being reset
  const [newPass, setNewPass] = useState('');

  const load = () =>
    fetch('/api/admins').then((r) => r.json()).then((d) => setList(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    const res = await fetch('/api/admins', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) return setError(data.error || 'Could not create account');
    setForm({ username: '', password: '', role: form.role });
    load();
  };

  const remove = async () => {
    const res = await fetch(`/api/admins/${del.id}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) setError(data.error || 'Could not delete'); else setError('');
    setDel(null); load();
  };

  const doReset = async () => {
    const res = await fetch(`/api/admins/${reset.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: newPass }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setError(data.error || 'Could not reset');
    setError(''); setReset(null); setNewPass('');
  };

  return (
    <>
      <PageHeader title="Team Access" subtitle="Create team logins. Officers see only Grievances for their wing; Content Managers see only Events, Blog / Press and Gallery." />

      <form onSubmit={create} className="mb-8 grid gap-4 rounded-2xl bg-white p-6 shadow-card sm:grid-cols-2">
        <Field label="Username"><input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className={inputClass()} autoComplete="off" /></Field>
        <Field label="Temporary password" hint="At least 8 characters. Ask the officer to keep it private."><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass()} autoComplete="new-password" /></Field>
        <div className="sm:col-span-2">
          <Field label="Role" hint={ROLES.find((r) => r.id === form.role)?.hint}>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass()}>
              {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </Field>
        </div>
        {error && <p className="text-sm font-semibold text-saffron-dark sm:col-span-2">{error}</p>}
        <div className="sm:col-span-2"><Button type="submit" disabled={saving}><UserPlus size={16} /> {saving ? 'Creating…' : 'Create account'}</Button></div>
      </form>

      {loading ? <p className="text-sm text-ink-soft">Loading…</p> : list.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No accounts" />
      ) : (
        <ul className="space-y-3">
          {list.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-card">
              <span className="font-bold text-ink">{a.username}</span>
              <Badge tone={a.role === 'super' ? 'saffron' : a.role === 'content_manager' ? 'ink' : 'banyan'}>{label(a.role)}</Badge>
              <span className="ml-auto flex gap-2">
                <Button type="button" variant="secondary" onClick={() => { setReset(a); setNewPass(''); setError(''); }}><KeyRound size={14} /> Reset password</Button>
                <Button type="button" variant="danger" onClick={() => setDel(a)}><Trash2 size={14} /></Button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} title="Delete this account?" description={del ? `${del.username} will lose access immediately.` : ''} />

      {reset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-card-hover">
            <h3 className="font-display text-lg font-bold text-ink">Reset password for {reset.username}</h3>
            <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New password (8+ characters)" className={`${inputClass()} mt-4`} autoComplete="new-password" />
            {error && <p className="mt-2 text-xs font-semibold text-saffron-dark">{error}</p>}
            <div className="mt-5 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setReset(null)}>Cancel</Button>
              <Button type="button" onClick={doReset} disabled={newPass.length < 8}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
