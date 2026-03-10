import { useState } from 'react'
import { DEFAULT_PLACE } from '@/core/constants'
import type { Place } from '@/core/types/place'
import { CitySearch } from '@/features/search/components/CitySearch'
import { WeatherDashboard } from '@/features/weather/components/WeatherDashboard'
import styles from './App.module.css'

export function App() {
  const [place, setPlace] = useState<Place>(DEFAULT_PLACE)

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
        </div>
      </header>

      <main id="conteudo" className={styles.main} tabIndex={-1}>
        <WeatherDashboard place={place} />
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
