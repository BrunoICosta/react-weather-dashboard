import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { useUnits } from '@/features/settings/units/unitsContext'
import { useFormatters } from '@/i18n/useFormatters'
import { Card } from '@/shared/components/Card'
import { useWeatherDescription } from '../lib/weatherCodes'
import type { DailyPoint } from '../types'
import styles from './DailyForecast.module.css'
import { WeatherIcon } from './WeatherIcon'

interface DailyForecastProps {
  days: DailyPoint[]
}

export function DailyForecast({ days }: DailyForecastProps) {
  const { t } = useTranslation('weather', { keyPrefix: 'daily' })
  const { formatTemperature } = useUnits()
  const format = useFormatters()
  const describe = useWeatherDescription()

  if (days.length === 0) {
    return (
      <Card title={t('title')}>
        <p className={styles.empty}>{t('empty')}</p>
      </Card>
    )
  }

  // Shared scale so the range bars are comparable across the week.
  const weekMin = Math.min(...days.map((day) => day.temperatureMin))
  const weekMax = Math.max(...days.map((day) => day.temperatureMax))
  const span = Math.max(weekMax - weekMin, 1)

  return (
    <Card title={t('title')}>
      <ol className={styles.list}>
        {days.map((day, index) => {
          const range = {
            '--start': `${((day.temperatureMin - weekMin) / span) * 100}%`,
            '--end': `${((weekMax - day.temperatureMax) / span) * 100}%`,
          } as CSSProperties

          return (
            <li key={day.date} className={styles.day}>
              <span className={styles.weekday}>
                <span aria-hidden="true">
                  {index === 0 ? t('today') : format.weekday(day.date)}
                </span>
                <span className="sr-only">
                  {index === 0 ? t('todayPrefix') : ''}
                  {format.longDate(day.date)}
                </span>
              </span>

              <span className={styles.condition}>
                <WeatherIcon code={day.weatherCode} size={36} />
                <span className="sr-only">{describe(day.weatherCode)}</span>
              </span>

              <span className={styles.rain} title={t('rainChanceTitle')}>
                <svg viewBox="0 0 12 16" aria-hidden="true" focusable="false">
                  <path d="M6 1C6 1 1 7 1 10a5 5 0 0 0 10 0C11 7 6 1 6 1z" fill="currentColor" />
                </svg>
                <span className="sr-only">{t('rainChance')} </span>
                {format.percent(day.precipitationProbabilityMax)}
              </span>

              <span className={styles.temperatures}>
                <span className={styles.min}>
                  <span className="sr-only">{t('min')} </span>
                  {formatTemperature(day.temperatureMin)}
                </span>
                <span className={styles.bar} style={range} aria-hidden="true" />
                <span className={styles.max}>
                  <span className="sr-only">{t('max')} </span>
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
