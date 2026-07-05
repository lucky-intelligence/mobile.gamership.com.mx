import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// `dashboard` is consumed by the account-ui dashboard via useTranslation('dashboard').
import { common } from './locales/common';
import { landing } from './locales/landing';
import { dashboard } from './locales/dashboard';

export const LANGS = ['es', 'en'] as const;
export type Lang = (typeof LANGS)[number];

const resources = {
  es: { common: common.es, landing: landing.es, dashboard: dashboard.es },
  en: { common: common.en, landing: landing.en, dashboard: dashboard.en },
};

// No language detection: the site always starts in Spanish (never inferred from
// the browser). The header toggle changes the language at runtime.
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'es',
    supportedLngs: LANGS,
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // Preact/React already escapes against XSS
    },
  });

export default i18n;
