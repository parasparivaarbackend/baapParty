'use client';

import { useEffect, useState } from 'react';
import { MapPin, X, SlidersHorizontal } from 'lucide-react';
import { useContentFilter, ALL_VALUE } from '@/context/FilterContext';

export default function GlobalFilterBar() {
  const { filter, setState, setCity, setCategory, clearFilter, isActive } = useContentFilter();
  const [options, setOptions] = useState({ states: [], citiesByState: {}, categories: [] });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch('/api/filters')
      .then((r) => r.json())
      .then((data) => alive && setOptions(data))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const cityOptions =
    filter.state !== ALL_VALUE ? options.citiesByState?.[filter.state] || [] : [];

  return (
    <div className="border-b border-ink/10 bg-ivory/95">
      <div className="mx-auto max-w-7xl px-5 py-2.5 lg:px-8">
        {/* Compact toggle row */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink"
          >
            <SlidersHorizontal size={14} className="text-saffron" />
            Filter Content
            {isActive && (
              <span className="rounded-full bg-saffron px-2 py-0.5 text-[10px] text-white">On</span>
            )}
          </button>

          {isActive && (
            <button
              type="button"
              onClick={clearFilter}
              className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft hover:text-saffron"
            >
              <X size={13} /> Clear
            </button>
          )}
        </div>

        {open && (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                State
              </label>
              <select
                value={filter.state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-xl border-2 border-ink/10 bg-white px-3.5 py-2 text-sm text-ink outline-none focus:border-saffron"
              >
                <option value={ALL_VALUE}>All States</option>
                {options.states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                City / Village / Area
              </label>
              <div className="relative">
                <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/50" />
                <input
                  list="jsm-city-suggestions"
                  value={filter.city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={filter.state === ALL_VALUE}
                  placeholder={filter.state === ALL_VALUE ? 'Select a state first' : 'e.g. Rohini'}
                  className="w-full rounded-xl border-2 border-ink/10 bg-white py-2 pl-9 pr-3.5 text-sm text-ink outline-none focus:border-saffron disabled:cursor-not-allowed disabled:bg-ink/5"
                />
                <datalist id="jsm-city-suggestions">
                  {cityOptions.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                Category
              </label>
              <select
                value={filter.category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border-2 border-ink/10 bg-white px-3.5 py-2 text-sm text-ink outline-none focus:border-saffron"
              >
                <option value={ALL_VALUE}>All Categories</option>
                {options.categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
