import type { Place } from '@/core/types/place'
import { useGeolocation } from '../hooks/useGeolocation'
import { createCurrentLocationPlace } from '../lib/currentLocationPlace'
import styles from './LocationButton.module.css'

interface LocationButtonProps {
  onLocate: (place: Place) => void
}

export function LocationButton({ onLocate }: LocationButtonProps) {
  const { status, error, permission, locate, dismissError } = useGeolocation()
  const locating = status === 'locating'
  const denied = permission === 'denied'

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={() => locate((coordinates) => onLocate(createCurrentLocationPlace(coordinates)))}
        disabled={locating || permission === 'unsupported'}
        aria-busy={locating}
        title={
          denied
            ? 'O acesso à localização está bloqueado neste navegador'
            : 'Usar minha localização atual'
        }
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.icon}>
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <path
            d="M12 2v3m0 14v3M2 12h3m14 0h3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className={styles.label}>{locating ? 'Localizando…' : 'Minha localização'}</span>
      </button>

      {error && (
        <div className={styles.error} role="alert">
          <p>{error}</p>
          <button type="button" className={styles.dismiss} onClick={dismissError}>
            <span aria-hidden="true">×</span>
            <span className="sr-only">Fechar aviso</span>
          </button>
        </div>
      )}
    </div>
  )
}
