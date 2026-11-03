import i18next, { type i18n as I18n } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { en } from './locales/en'
import { ptBR } from './locales/pt-BR'

export const SUPPORTED_LANGUAGES = ['pt-BR', 'en'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'pt-BR'
export const LANGUAGE_STORAGE_KEY = 'clima:language'
export const NAMESPACES = ['common', 'weather', 'search', 'location', 'cities', 'settings'] as const

export const resources = { 'pt-BR': ptBR, en } as const

/** Any Portuguese variant (pt, pt-PT, pt-BR…) uses pt-BR; everything else falls back to English. */
export function normalizeLanguage(language: string | undefined | null): Language {
  if (!language) return DEFAULT_LANGUAGE
  return language.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en'
}

export function isLanguage(value: unknown): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language)
}

/** Keeps `<html lang>`, the document title and the meta description in sync with the language. */
function syncDocument(instance: I18n) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = instance.resolvedLanguage ?? DEFAULT_LANGUAGE
  document.title = instance.t('common:documentTitle')
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', instance.t('common:metaDescription'))
}

/**
 * Creates a configured i18next instance. Initial language: saved choice (localStorage) >
 * browser language > pt-BR. Resources are bundled, so initialization is synchronous.
 */
export function createI18n(): I18n {
  const instance = i18next.createInstance()

  instance
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      ns: NAMESPACES,
      defaultNS: 'common',
      supportedLngs: SUPPORTED_LANGUAGES,
      fallbackLng: DEFAULT_LANGUAGE,
      initAsync: false,
      interpolation: { escapeValue: false }, // React already escapes.
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: LANGUAGE_STORAGE_KEY,
        caches: ['localStorage'],
        convertDetectedLanguage: normalizeLanguage,
      },
    })
    .catch((error: unknown) => console.error('i18n initialization failed', error))

  syncDocument(instance)
  instance.on('languageChanged', () => syncDocument(instance))
  return instance
}

export const i18n = createI18n()
