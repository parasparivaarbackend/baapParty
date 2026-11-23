// One shared rule for every free-text box a visitor can write in: at most 1000 words.
// Used by the browser (LimitedTextarea) and again on the server (API routes), so the
// limit cannot be skipped by calling the API directly.

export const MAX_WORDS = 1000;

export function countWords(text) {
  return (String(text ?? '').match(/\S+/g) || []).length;
}

/** Cuts the text after the `max`-th word (keeps the spacing / line breaks of what was kept). */
export function limitWords(text, max = MAX_WORDS) {
  const s = String(text ?? '');
  const re = /\S+/g;
  let count = 0;
  let m;
  while ((m = re.exec(s))) {
    if (++count > max) return s.slice(0, m.index).trimEnd();
  }
  return s;
}

export const WORD_LIMIT_ERROR = `Please keep it within ${MAX_WORDS} words.`;

/** Server side: cleaned text, or `error` when it is longer than the limit. */
export function checkWords(text, max = MAX_WORDS) {
  const s = String(text ?? '').trim();
  if (countWords(s) > max) return { error: `Please keep it within ${max} words.` };
  return { text: s };
}
