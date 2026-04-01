import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { Place } from '@/core/types/place'
import { forecastQueryOptions } from '@/features/weather/api/forecastQuery'
import styles from './SavedCities.module.css'

interface SavedCitiesProps {
  cities: Place[]
  selectedId: string
  onSelect: (place: Place) => void
  onRemove: (id: string) => void
}

export function SavedCities({ cities, selectedId, onSelect, onRemove }: SavedCitiesProps) {
  const { t } = useTranslation('cities')
  const queryClient = useQueryClient()

  // Warm the cache when the user is about to switch, so the dashboard renders instantly.
  const prefetch = (city: Place) => void queryClient.prefetchQuery(forecastQueryOptions(city))

  return (
    <nav className={styles.nav} aria-label={t('navLabel')}>
      {cities.length === 0 ? (
        <p className={styles.empty}>{t('empty')}</p>
      ) : (
        <ul className={styles.list}>
          {cities.map((city) => {
            const selected = city.id === selectedId
            return (
              <li key={city.id} className={styles.chip} data-selected={selected}>
                <button
                  type="button"
                  className={styles.select}
                  aria-current={selected ? 'true' : undefined}
                  onClick={() => onSelect(city)}
                  onPointerEnter={() => prefetch(city)}
                  onFocus={() => prefetch(city)}
                >
                  {city.name}
                  {city.countryCode && <span className={styles.code}>{city.countryCode}</span>}
                </button>
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => onRemove(city.id)}
                  aria-label={t('remove', { name: city.name })}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </nav>
  )
}
