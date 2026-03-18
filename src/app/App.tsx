import { useState } from 'react'
import { DEFAULT_PLACE } from '@/core/constants'
import type { Place } from '@/core/types/place'
import { SaveCityButton } from '@/features/cities/components/SaveCityButton'
import { useSavedCities } from '@/features/cities/hooks/useSavedCities'
import { UnitToggle } from '@/features/settings/components/UnitToggle'
import { LocationButton } from '@/features/location/components/LocationButton'
import { CitySearch } from '@/features/search/components/CitySearch'
import { WeatherDashboard } from '@/features/weather/components/WeatherDashboard'
import styles from './App.module.css'

export function App() {
  const [place, setPlace] = useState<Place>(DEFAULT_PLACE)
  const savedCities = useSavedCities()
  const saved = savedCities.isSaved(place.id)

  return (
    <div className={styles.app}>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className={styles.header}>
        <div className={styles.brand}>
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={32} height={32} />
          <h1 className={styles.title}>Clima</h1>
        </div>
        <div className={styles.toolbar}>
          <CitySearch onSelect={setPlace} />
          <LocationButton onLocate={setPlace} />
        </div>
        <div className={styles.units}>
          <UnitToggle />
        </div>
      </header>

      <main id="conteudo" className={styles.main} tabIndex={-1}>
        <WeatherDashboard
          place={place}
          placeAction={
            !place.isCurrentLocation && (
              <SaveCityButton
                cityName={place.name}
                saved={saved}
                onToggle={() => (saved ? savedCities.remove(place.id) : savedCities.save(place))}
              />
            )
          }
        />
      </main>

      <footer className={styles.footer}>
        Dados meteorológicos por{' '}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo.com
        </a>{' '}
        (CC BY 4.0)
      </footer>
    </div>
  )
}
