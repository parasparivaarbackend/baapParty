'use client';

import { useEffect, useState } from 'react';
import { MapPin, SlidersHorizontal, X } from 'lucide-react';

export const ALL_VALUE = 'All';
export const defaultFilterValue = { state: ALL_VALUE, city: '', category: ALL_VALUE };

export function isFilterActive(value) {
  return value.state !== ALL_VALUE || !!value.city.trim() || value.category !== ALL_VALUE;
}

export function matchesFilter(item, value) {
  if (!item) return false;
  if (value.state !== ALL_VALUE && (item.state || '') !== value.state) return false;
  if (value.city.trim() && !(item.city || '').toLowerCase().includes(value.city.trim().toLowerCase())) {
    return false;
  }
  if (value.category !== ALL_VALUE && (item.category || '') !== value.category) return false;
  return true;
}

/**
 * Icon-only filter button that expands into its own State / City / Category
 * panel. Fully self-contained per instance — each section (Events, Blog,
 * Gallery) gets its own independent filter state via `value`/`onChange`,
 * so filtering one section never affects another. `type` scopes the
 * suggested cities/categories to that content type only.
 */
export default function InlineContentFilter({ type, value, onChange }) {
  const [options, setOptions] = useState({ states: [], citiesByState: {}, categories: [] });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/filters?type=${encodeURIComponent(type || '')}`)
      .then((r) => r.json())
      .then((data) => alive && setOptions(data))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [type]);

  const active = isFilterActive(value);
  const cityOptions = value.state !== ALL_VALUE ? options.citiesByState?.[value.state] || [] : [];

  const update = (patch) => onChange({ ...value, ...patch });
  const clear = () => onChange(defaultFilterValue);

  return (
    <span className="relative inline-flex align-middle z-10">
      <button
        type="button"
        aria-label="Filter this section"
        onClick={() => setOpen((v) => !v)}
        className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors sm:h-9 sm:w-9 ${
          active
            ? 'border-saffron bg-saffron text-white'
            : 'border-ink/15 text-ink-soft hover:border-saffron hover:text-saffron'
        }`}
      >
        <SlidersHorizontal size={15} />
        {active && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-saffron" />
        )}
      </button>

      {open && (
        <>
          {/* Backdrop: dims the screen + closes on tap. Only visible on mobile,
              where the panel becomes a centered sheet instead of a dropdown. */}
          <div
            className="fixed inset-0 z-40 bg-ink/30 sm:bg-transparent"
            onClick={() => setOpen(false)}
          />

          <div
            className="fixed left-1/2 top-1/2 z-50 w-[88vw] max-w-xs -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-ink/8 bg-white p-4 text-left shadow-card-hover
                       sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72 sm:max-w-none sm:translate-x-0 sm:translate-y-0"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">Filter this section</p>
              <div className="flex items-center gap-2">
                {active && (
                  <button
                    type="button"
                    onClick={clear}
                    className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-saffron hover:text-saffron-dark"
                  >
                    <X size={12} /> Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-ink-soft hover:text-ink sm:hidden"
                  aria-label="Close filter"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-soft/70">
                  State
                </label>
                <select
                  value={value.state}
                  onChange={(e) => update({ state: e.target.value, city: '' })}
                  className="w-full rounded-xl border-2 border-ink/10 bg-ivory px-3 py-2.5 text-sm text-ink outline-none focus:border-saffron sm:py-2"
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
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-soft/70">
                  City / Village / Area
                </label>
                <div className="relative">
                  <MapPin size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-soft/50" />
                  <input
                    list={`jsm-city-suggestions-${type || 'all'}`}
                    value={value.city}
                    onChange={(e) => update({ city: e.target.value })}
                    disabled={value.state === ALL_VALUE}
                    placeholder={value.state === ALL_VALUE ? 'Select a state first' : 'e.g. Rohini'}
                    className="w-full rounded-xl border-2 border-ink/10 bg-ivory py-2.5 pl-8 pr-3 text-sm text-ink outline-none focus:border-saffron disabled:cursor-not-allowed disabled:bg-ink/5 sm:py-2"
                  />
                  <datalist id={`jsm-city-suggestions-${type || 'all'}`}>
                    {cityOptions.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              {options.categories.length > 0 && (
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-soft/70">
                    Category
                  </label>
                  <select
                    value={value.category}
                    onChange={(e) => update({ category: e.target.value })}
                    className="w-full rounded-xl border-2 border-ink/10 bg-ivory px-3 py-2.5 text-sm text-ink outline-none focus:border-saffron sm:py-2"
                  >
                    <option value={ALL_VALUE}>All Categories</option>
                    {options.categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </span>
  );
}
