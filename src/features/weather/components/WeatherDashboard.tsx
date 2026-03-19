import type { ReactNode } from 'react'
import type { Place } from '@/core/types/place'
import { useWeatherTheme } from '@/features/theme/useWeatherTheme'
import { useForecast } from '../hooks/useForecast'
import { CurrentConditions } from './CurrentConditions'
import { DailyForecast } from './DailyForecast'
import { HourlyChart } from './HourlyChart'
import styles from './WeatherDashboard.module.css'

interface WeatherDashboardProps {
  place: Place
  placeAction?: ReactNode
}

export function WeatherDashboard({ place, placeAction }: WeatherDashboardProps) {
  const { data, isPending, isError, error, refetch } = useForecast(place)
  useWeatherTheme(data?.current.weatherCode, data?.current.isDay)

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
        <CurrentConditions
          place={place}
          current={data.current}
          today={data.daily[0]}
          action={placeAction}
        />
      </div>
      <div className={styles.hourly}>
        <HourlyChart points={data.hourly} />
      </div>
      <div className={styles.daily}>
        <DailyForecast days={data.daily} />
      </div>
    </div>
  )
}
