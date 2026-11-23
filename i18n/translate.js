// Plain (non-client) module so both server and client code can translate.
import hi from '@/i18n/hi';

export function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (m, k) => (vars[k] === undefined ? m : String(vars[k])));
}

/** Translate an English string. Falls back to the English text if no Hindi entry exists. */
export function translate(lang, en, vars) {
  if (typeof en !== 'string') return en;
  const out = lang === 'hi' && hi[en] ? hi[en] : en;
  return interpolate(out, vars);
}
