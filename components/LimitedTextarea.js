'use client';

import { useLang } from '@/context/LanguageContext';
import { countWords, limitWords, MAX_WORDS } from '@/lib/wordLimit';

// A textarea that stops accepting words after the limit (typing and pasting both),
// with a live "123 / 1000 words" counter underneath.
export default function LimitedTextarea({ value, onChange, maxWords = MAX_WORDS, className = '', ...rest }) {
  const { t } = useLang();
  const words = countWords(value);
  const full = words >= maxWords;

  const handle = (e) => {
    const next = limitWords(e.target.value, maxWords);
    onChange(next);
  };

  return (
    <>
      <textarea {...rest} value={value} onChange={handle} className={className} />
      <p className={`mt-1.5 text-right text-xs ${full ? 'font-semibold text-saffron-dark' : 'text-ink-soft/70'}`}>
        {full ? t('{words} / {max} words - limit reached', { words, max: maxWords }) : t('{words} / {max} words', { words, max: maxWords })}
      </p>
    </>
  );
}
