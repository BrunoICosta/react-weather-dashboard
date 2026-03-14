import type { CSSProperties } from 'react'
import { Card } from '@/shared/components/Card'
import { useUnits } from '@/features/settings/units/unitsContext'
import { formatLongDate, formatPercent, formatWeekday } from '@/shared/lib/format'
import { getWeatherDescription } from '../lib/weatherCodes'
import type { DailyPoint } from '../types'
import styles from './DailyForecast.module.css'
import { WeatherIcon } from './WeatherIcon'

interface DailyForecastProps {
  days: DailyPoint[]
}

export function DailyForecast({ days }: DailyForecastProps) {
  const { formatTemperature } = useUnits()

  if (days.length === 0) {
    return (
      <Card title="Próximos 7 dias">
        <p className={styles.empty}>Sem previsão diária para este local.</p>
      </Card>
    )
  }

  // Shared scale so the range bars are comparable across the week.
  const weekMin = Math.min(...days.map((day) => day.temperatureMin))
  const weekMax = Math.max(...days.map((day) => day.temperatureMax))
  const span = Math.max(weekMax - weekMin, 1)

  return (
    <Card title="Próximos 7 dias">
      <ol className={styles.list}>
        {days.map((day, index) => {
          const description = getWeatherDescription(day.weatherCode)
          const range = {
            '--start': `${((day.temperatureMin - weekMin) / span) * 100}%`,
            '--end': `${((weekMax - day.temperatureMax) / span) * 100}%`,
          } as CSSProperties

          return (
            <li key={day.date} className={styles.day}>
              <span className={styles.weekday}>
                <span aria-hidden="true">{index === 0 ? 'Hoje' : formatWeekday(day.date)}</span>
                <span className="sr-only">
                  {index === 0 ? 'Hoje, ' : ''}
                  {formatLongDate(day.date)}
                </span>
              </span>

              <span className={styles.condition}>
                <WeatherIcon code={day.weatherCode} size={36} />
                <span className="sr-only">{description}</span>
              </span>

              <span className={styles.rain} title="Chance máxima de chuva">
                <svg viewBox="0 0 12 16" aria-hidden="true" focusable="false">
                  <path d="M6 1C6 1 1 7 1 10a5 5 0 0 0 10 0C11 7 6 1 6 1z" fill="currentColor" />
                </svg>
                <span className="sr-only">Chance de chuva: </span>
                {formatPercent(day.precipitationProbabilityMax)}
              </span>

              <span className={styles.temperatures}>
                <span className={styles.min}>
                  <span className="sr-only">Mínima </span>
                  {formatTemperature(day.temperatureMin)}
                </span>
                <span className={styles.bar} style={range} aria-hidden="true" />
                <span className={styles.max}>
                  <span className="sr-only">Máxima </span>
                  {formatTemperature(day.temperatureMax)}
                </span>
              </span>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}
