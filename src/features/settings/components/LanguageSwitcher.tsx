import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { normalizeLanguage, SUPPORTED_LANGUAGES, type Language } from '@/i18n/config'
import { SegmentedControl } from '@/shared/components/SegmentedControl'

const SHORT_LABEL: Record<Language, string> = { 'pt-BR': 'PT', en: 'EN' }

/**
 * Switches the UI language. i18next persists the choice in localStorage and `<html lang>` is
 * updated by the i18n setup.
 */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const name = useId()
  const current = normalizeLanguage(i18n.resolvedLanguage)

  return (
    <SegmentedControl
      label={t('language')}
      name={`${name}-language`}
      value={current}
      onChange={(language) => void i18n.changeLanguage(language)}
      options={SUPPORTED_LANGUAGES.map((language) => ({
        value: language,
        label: SHORT_LABEL[language],
        // Each language is named in itself ("English", "Português (Brasil)").
        accessibleLabel: t(`languages.${language}`, { lng: language }),
        lang: language,
      }))}
    />
  )
}
