import type { ReactNode } from 'react'
import type { Place } from '@/core/types/place'
import { useWeatherTheme } from '@/features/theme/useWeatherTheme'
import { ErrorState } from '@/shared/components/ErrorState'
import { useForecast } from '../hooks/useForecast'
import { CurrentConditions } from './CurrentConditions'
import { DailyForecast } from './DailyForecast'
import { HourlyChart } from './HourlyChart'
import { WeatherDashboardSkeleton } from './WeatherDashboardSkeleton'
import styles from './WeatherDashboard.module.css'

interface WeatherDashboardProps {
  place: Place
  placeAction?: ReactNode
}

export function WeatherDashboard({ place, placeAction }: WeatherDashboardProps) {
  const { data, isPending, isError, error, refetch, isFetching } = useForecast(place)
  useWeatherTheme(data?.current.weatherCode, data?.current.isDay)

  if (isPending) return <WeatherDashboardSkeleton />

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar a previsão"
        message={error.message}
        onRetry={() => void refetch()}
        retrying={isFetching}
      />
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
