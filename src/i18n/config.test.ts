import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createI18n, LANGUAGE_STORAGE_KEY, normalizeLanguage } from './config'
import { en } from './locales/en'
import { ptBR } from './locales/pt-BR'

function mockBrowserLanguages(languages: string[]) {
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages)
  vi.spyOn(navigator, 'language', 'get').mockReturnValue(languages[0] ?? '')
}

afterEach(() => vi.restoreAllMocks())

describe('normalizeLanguage', () => {
  it.each([
    ['pt-BR', 'pt-BR'],
    ['pt', 'pt-BR'],
    ['pt-PT', 'pt-BR'],
    ['en-US', 'en'],
    ['fr-FR', 'en'],
    [undefined, 'pt-BR'],
    ['', 'pt-BR'],
  ])('%s → %s', (input, expected) => {
    expect(normalizeLanguage(input)).toBe(expected)
  })
})

describe('language detection', () => {
  // The shared test setup switches the app instance to pt-BR, which i18next caches in storage.
  beforeEach(() => localStorage.removeItem(LANGUAGE_STORAGE_KEY))

  it('prefers the saved choice over the browser language', () => {
    mockBrowserLanguages(['pt-BR'])
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en')

    expect(createI18n().resolvedLanguage).toBe('en')
  })

  it('maps any Portuguese browser language to pt-BR', () => {
    mockBrowserLanguages(['pt-PT', 'en'])
    expect(createI18n().resolvedLanguage).toBe('pt-BR')
  })

  it('uses English for any other browser language', () => {
    mockBrowserLanguages(['de-DE'])
    expect(createI18n().resolvedLanguage).toBe('en')
  })

  it('persists the choice and updates <html lang> and the title', async () => {
    mockBrowserLanguages(['pt-BR'])
    const i18n = createI18n()
    expect(document.documentElement.lang).toBe('pt-BR')

    await i18n.changeLanguage('en')

    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe(en.common.documentTitle)
  })
})

describe('resources', () => {
  // `satisfies LocaleResources` already enforces this at compile time; this guards against
  // accidental empty strings.
  it('has a non-empty English translation for every pt-BR key', () => {
    const flatten = (value: object, prefix = ''): [string, unknown][] =>
      Object.entries(value).flatMap(([key, child]) =>
        typeof child === 'object' && child !== null
          ? flatten(child, `${prefix}${key}.`)
          : [[`${prefix}${key}`, child]],
      )
    const english = new Map(flatten(en))

    for (const [key] of flatten(ptBR)) {
      expect(english.get(key), key).toEqual(expect.stringMatching(/\S/))
    }
  })
})
