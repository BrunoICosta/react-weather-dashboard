import { useTranslation } from 'react-i18next'
import styles from './SaveCityButton.module.css'

interface SaveCityButtonProps {
  cityName: string
  saved: boolean
  onToggle: () => void
}

export function SaveCityButton({ cityName, saved, onToggle }: SaveCityButtonProps) {
  const { t } = useTranslation('cities')
  return (
    <button
      type="button"
      className={styles.button}
      aria-pressed={saved}
      onClick={onToggle}
      title={saved ? t('removeTitle') : t('saveTitle')}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.icon}>
        <path
          d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
      {/* With aria-pressed the name stays constant; the pressed state conveys saved/unsaved. */}
      <span className="sr-only">{t('save', { name: cityName })}</span>
    </button>
  )
}
