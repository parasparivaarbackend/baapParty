'use client';

import { Field, inputClass } from '@/components/admin/ui';
import { INDIAN_STATES } from '@/lib/locations';

/**
 * Renders State + City/Village/Area inputs. Tag content with these so
 * visitors can find it via the site-wide location filter.
 */
export default function LocationFields({ state, city, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="State" hint="Used by the site-wide content filter">
        <select
          className={inputClass()}
          value={state || ''}
          onChange={(e) => onChange({ state: e.target.value, city })}
        >
          <option value="">Select state (optional)</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>
      <Field label="City / Village / Area">
        <input
          className={inputClass()}
          value={city || ''}
          onChange={(e) => onChange({ state, city: e.target.value })}
          placeholder="e.g. Rohini"
        />
      </Field>
    </div>
  );
}
