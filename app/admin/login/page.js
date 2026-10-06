'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Flame, Lock } from 'lucide-react';
import { Field, inputClass, Button } from '@/components/admin/ui';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username.trim() || !form.password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || 'Invalid username or password');
        setLoading(false);
        return;
      }
      // Roles with a limited panel start on their own page; a super admin keeps `from`.
      const HOME = { youth_officer: '/admin/grievances', women_officer: '/admin/grievances', content_manager: '/admin/events' };
      router.push(data.role && HOME[data.role] ? HOME[data.role] : from);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-card-hover">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-marigold text-ink">
            <Flame size={22} strokeWidth={2.2} />
          </span>
          <h1 className="mt-4 font-display text-xl font-extrabold text-ink">Admin Login</h1>
          <p className="mt-1 text-sm text-ink-soft">Bharatiya Avijit Aawaz Party — Admin Panel</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Username">
            <input
              type="text"
              autoComplete="username"
              className={inputClass(false)}
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              autoComplete="current-password"
              className={inputClass(false)}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </Field>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">{error}</p>
          )}

          <Button type="submit" className="w-full justify-center" disabled={loading}>
            <Lock size={16} />
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
