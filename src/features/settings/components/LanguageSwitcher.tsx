import { useId, type ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { normalizeLanguage, SUPPORTED_LANGUAGES, type Language } from '@/i18n/config'
import { BrazilFlag, UsaFlag } from './Flags'
import styles from './LanguageSwitcher.module.css'

const FLAGS: Record<Language, ComponentType<{ className?: string }>> = {
  'pt-BR': BrazilFlag,
  en: UsaFlag,
}

/**
 * Switches the UI language with two flag radios. Native radio inputs give the expected keyboard
 * behaviour (Tab into the group, arrow keys between languages). Each option is named in its own
 * language ("Português (Brasil)", "English"); the flags are decorative.
 * i18next persists the choice and the i18n setup keeps `<html lang>` in sync.
 */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const name = useId()
  const current = normalizeLanguage(i18n.resolvedLanguage)

  return (
    <div role="radiogroup" aria-label={t('language')} className={styles.group}>
      {SUPPORTED_LANGUAGES.map((language) => {
        const Flag = FLAGS[language]
        const label = t(`languages.${language}`, { lng: language })
        return (
          <label key={language} className={styles.option} title={label}>
            <input
              type="radio"
              name={name}
              value={language}
              checked={language === current}
              onChange={() => void i18n.changeLanguage(language)}
              className={styles.input}
              aria-label={label}
              lang={language}
            />
            <span className={styles.flag}>
              <Flag />
            </span>
          </label>
        )
      })}
    </div>
  )
}
