'use client';

import { useEffect, useState } from 'react';
import { UserCircle2, Trash2, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { ConfirmDialog, PageHeader, EmptyState, Button } from '@/components/admin/ui';

const formatDateTime = (d) =>
  new Date(d).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/users/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    if (!users.length) return;
    const exportData = users.map((u) => ({
      Name: u.name || '',
      Email: u.email || '',
      Phone: u.phone || '',
      'Registered On': u.createdAt ? formatDateTime(u.createdAt) : '',
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'users');
    worksheet['!cols'] = [{ wch: 25 }, { wch: 32 }, { wch: 20 }, { wch: 24 }];
    XLSX.writeFile(workbook, `registered-users-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <>
      <PageHeader
        title="Registered Users"
        subtitle="Everyone who has created an account via the site's Login / Sign Up page."
        action={
          <Button variant="secondary" onClick={handleExport} disabled={!users.length}>
            <Download size={16} /> Export Excel
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-ink-soft">Loading...</p>
      ) : users.length === 0 ? (
        <EmptyState
          icon={UserCircle2}
          title="No registered users yet"
          description="They'll show up here as soon as a visitor creates an account on the site."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/8 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/8 bg-ivory/60 text-xs font-bold uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Registered</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-ivory/40">
                  <td className="px-5 py-4 font-semibold text-ink">{u.name}</td>
                  <td className="px-5 py-4 text-ink-soft">{u.email}</td>
                  <td className="px-5 py-4 text-ink-soft">{u.phone || '—'}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-ink-soft">
                    {u.createdAt ? formatDateTime(u.createdAt) : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setDeleteTarget(u)}
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

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove this user?"
        description={deleteTarget ? `${deleteTarget.name}'s account will be permanently deleted.` : ''}
      />
    </>
  );
}
