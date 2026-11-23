'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const FilterContext = createContext(null);

const STORAGE_KEY = 'jsm_content_filter';
export const ALL_VALUE = 'All';

const defaultFilter = { state: ALL_VALUE, city: '', category: ALL_VALUE };

export function FilterProvider({ children }) {
  const [filter, setFilter] = useState(defaultFilter);
  const [hydrated, setHydrated] = useState(false);

  // Load any previously chosen filter on first mount so it persists across
  // page navigations and visits.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setFilter({ ...defaultFilter, ...JSON.parse(saved) });
    } catch {
      // ignore malformed/missing storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filter));
    } catch {
      // ignore write failures (e.g. storage disabled)
    }
  }, [filter, hydrated]);

  const setState = (state) => setFilter((f) => ({ ...f, state, city: '' }));
  const setCity = (city) => setFilter((f) => ({ ...f, city }));
  const setCategory = (category) => setFilter((f) => ({ ...f, category }));
  const clearFilter = () => setFilter(defaultFilter);

  const isActive = filter.state !== ALL_VALUE || !!filter.city.trim() || filter.category !== ALL_VALUE;

  /** Returns true if a content item (event/blog/gallery item) matches the current filter. */
  const matches = (item) => {
    if (!item) return false;
    if (filter.state !== ALL_VALUE && (item.state || '') !== filter.state) return false;
    if (filter.city.trim() && !(item.city || '').toLowerCase().includes(filter.city.trim().toLowerCase())) {
      return false;
    }
    if (filter.category !== ALL_VALUE && (item.category || '') !== filter.category) return false;
    return true;
  };

  const value = useMemo(
    () => ({ filter, setState, setCity, setCategory, clearFilter, isActive, matches }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useContentFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error('useContentFilter must be used within a FilterProvider');
  }
  return ctx;
}
