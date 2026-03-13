import type { Place } from '@/core/types/place'
import { useForecast } from '../hooks/useForecast'
import { CurrentConditions } from './CurrentConditions'
import { HourlyChart } from './HourlyChart'
import styles from './WeatherDashboard.module.css'

interface WeatherDashboardProps {
  place: Place
}

export function WeatherDashboard({ place }: WeatherDashboardProps) {
  const { data, isPending, isError, error, refetch } = useForecast(place)

  if (isPending) {
    return <p role="status">Carregando previsão…</p>
  }

  if (isError) {
    return (
      <div role="alert">
        <p>Não foi possível carregar a previsão. {error.message}</p>
        <button type="button" onClick={() => void refetch()}>
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      <div className={styles.current}>
        <CurrentConditions place={place} current={data.current} today={data.daily[0]} />
      </div>
      <div className={styles.hourly}>
        <HourlyChart points={data.hourly} />
      </div>
    </div>
  )
}
