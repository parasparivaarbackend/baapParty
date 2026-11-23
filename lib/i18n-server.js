import { cookies } from 'next/headers';
import { translate } from '@/i18n/translate';

/** Server-component helper: const { t, lang, locale } = await getT(); */
export async function getT() {
  const store = await cookies();
  const lang = store.get('baap_lang')?.value === 'hi' ? 'hi' : 'en';
  return {
    lang,
    isHindi: lang === 'hi',
    locale: lang === 'hi' ? 'hi-IN' : 'en-IN',
    t: (en, vars) => translate(lang, en, vars),
  };
}
