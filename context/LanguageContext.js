'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { translate } from '@/i18n/translate';

export const LANG_COOKIE = 'baap_lang';

const LanguageContext = createContext(null);

export function LanguageProvider({ initialLang = 'en', children }) {
  const [lang, setLangState] = useState(initialLang === 'hi' ? 'hi' : 'en');
  const router = useRouter();

  const setLang = useCallback(
    (next) => {
      const value = next === 'hi' ? 'hi' : 'en';
      setLangState(value);
      try {
        document.cookie = `${LANG_COOKIE}=${value}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = value;
      } catch {
        // cookies blocked — language still switches for this visit
      }
      // Re-render server components that read the cookie (getT()).
      router.refresh();
    },
    [router]
  );

  const toggle = useCallback(() => setLang(lang === 'hi' ? 'en' : 'hi'), [lang, setLang]);

  const value = useMemo(
    () => ({
      lang,
      isHindi: lang === 'hi',
      locale: lang === 'hi' ? 'hi-IN' : 'en-IN',
      setLang,
      toggle,
      t: (en, vars) => translate(lang, en, vars),
    }),
    [lang, setLang, toggle]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/** const { t, lang, isHindi, locale, toggle, setLang } = useLang(); */
export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within a LanguageProvider');
  return ctx;
}
