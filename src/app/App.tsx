import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { Trans, useTranslation } from 'react-i18next'
import { DEFAULT_PLACE } from '@/core/constants'
import { isPlace } from '@/core/types/isPlace'
import type { Place } from '@/core/types/place'
import { SavedCities } from '@/features/cities/components/SavedCities'
import { SaveCityButton } from '@/features/cities/components/SaveCityButton'
import { useSavedCities } from '@/features/cities/hooks/useSavedCities'
import { LanguageSwitcher } from '@/features/settings/components/LanguageSwitcher'
import { UnitToggle } from '@/features/settings/components/UnitToggle'
import { LocationButton } from '@/features/location/components/LocationButton'
import { CitySearch } from '@/features/search/components/CitySearch'
import { WeatherDashboard } from '@/features/weather/components/WeatherDashboard'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { ErrorState } from '@/shared/components/ErrorState'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import styles from './App.module.css'

export function App() {
  const { t } = useTranslation()
  // The last viewed place is restored on the next visit.
  const [place, setPlace] = useLocalStorage<Place>('last-place', DEFAULT_PLACE, isPlace)
  const savedCities = useSavedCities()
  const saved = savedCities.isSaved(place.id)

  return (
    <div className={styles.app}>
      <a className="skip-link" href="#conteudo">
        {t('skipToContent')}
      </a>

      <header className={styles.header}>
        <div className={styles.brand}>
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={32} height={32} />
          <h1 className={styles.title}>{t('appName')}</h1>
        </div>
        <div className={styles.toolbar}>
          <CitySearch onSelect={setPlace} />
          <LocationButton onLocate={setPlace} />
        </div>
        <div className={styles.units}>
          <UnitToggle />
          <LanguageSwitcher />
        </div>
      </header>

      <main id="conteudo" className={styles.main} tabIndex={-1}>
        <SavedCities
          cities={savedCities.cities}
          selectedId={place.id}
          onSelect={setPlace}
          onRemove={savedCities.remove}
        />
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              resetKeys={[place.id]}
              fallback={({ reset: retry }) => (
                <ErrorState
                  title={t('errors.boundaryTitle')}
                  message={t('errors.boundaryMessage')}
                  onRetry={retry}
                />
              )}
            >
              <WeatherDashboard
                place={place}
                placeAction={
                  !place.isCurrentLocation && (
                    <SaveCityButton
                      cityName={place.name}
                      saved={saved}
                      onToggle={() =>
                        saved ? savedCities.remove(place.id) : savedCities.save(place)
                      }
                    />
                  )
                }
              />
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </main>

      <footer className={styles.footer}>
        <Trans
          t={t}
          i18nKey="attribution"
          components={{
            // <Trans> injects the link text from the translation.
            link: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" />,
          }}
        />
      </footer>
    </div>
  )
}
