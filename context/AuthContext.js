'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Single source of truth for the logged-in *site user* (not the admin).
//
// Why this exists: the Navbar lives in the root layout, so it is NOT remounted
// when you navigate from /login to /. It used to read the session only once on
// mount, so right after login it still showed "Login" until a full refresh.
// Now the login/signup pages call `login()` / `refresh()` on this context and
// every component (Navbar, dashboard, ...) updates instantly.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/user-auth/me', {
        cache: 'no-store',
        credentials: 'same-origin',
      });
      const data = res.ok ? await res.json() : null;
      const next = data?.authenticated ? data : null;
      setUser(next);
      return next;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Call right after a successful login/signup response so the UI updates
  // immediately (no waiting for another network round-trip).
  const login = useCallback((u) => {
    if (u) setUser({ authenticated: true, ...u });
    setLoading(false);
    refresh(); // pull the full profile in the background
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/user-auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, refresh, login, logout }),
    [user, loading, refresh, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
