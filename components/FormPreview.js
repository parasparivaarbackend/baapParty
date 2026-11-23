'use client';

import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

// "Check before you send" screen shown by the Contact and Join Us forms.
// The visitor reads everything back, then either goes back to edit or confirms the final submit.
export default function FormPreview({ title = 'Please review your details', rows, longText, longLabel = 'Message', onEdit, onConfirm, loading, error, confirmLabel = 'Confirm & Submit' }) {
  const { t } = useLang();
  return (
    <div className="rounded-3xl border border-ink/8 bg-white p-8 shadow-card sm:p-10">
      <h3 className="font-display text-2xl font-extrabold text-ink">{t(title)}</h3>
      <p className="mt-1 text-sm text-ink-soft">{t('Nothing has been sent yet. Check everything, then confirm.')}</p>

      <dl className="mt-6 divide-y divide-ink/8 rounded-2xl border border-ink/10">
        {rows.filter(([, v]) => v).map(([label, value]) => (
          <div key={label} className="grid gap-1 px-5 py-3 sm:grid-cols-[170px_1fr] sm:gap-4">
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-soft">{t(label)}</dt>
            <dd className="break-words text-sm font-semibold text-ink">{value}</dd>
          </div>
        ))}
        {longText ? (
          <div className="px-5 py-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-soft">{t(longLabel)}</dt>
            <dd className="mt-1 max-h-64 overflow-y-auto whitespace-pre-wrap break-words text-sm text-ink">{longText}</dd>
          </div>
        ) : null}
      </dl>

      {error && <p className="mt-4 text-sm font-semibold text-saffron-dark">{t(error)}</p>}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onEdit}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink/15 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink disabled:opacity-60"
        >
          <ArrowLeft size={16} /> {t('Edit')}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-saffron px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-saffron-dark disabled:opacity-70"
        >
          {loading ? <><Loader2 size={18} className="animate-spin" /> {t('Submitting...')}</> : <><Send size={17} /> {t(confirmLabel)}</>}
        </button>
      </div>
    </div>
  );
}
