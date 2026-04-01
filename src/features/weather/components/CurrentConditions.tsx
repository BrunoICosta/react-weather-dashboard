import { useId, type ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import type { Place } from '@/core/types/place'
import { useUnits } from '@/features/settings/units/unitsContext'
import { useFormatters } from '@/i18n/useFormatters'
import { Card } from '@/shared/components/Card'
import { getUvLevel } from '@/shared/lib/format'
import { useWeatherDescription } from '../lib/weatherCodes'
import type { CurrentWeather, DailyPoint } from '../types'
import styles from './CurrentConditions.module.css'
import { WeatherIcon } from './WeatherIcon'

interface CurrentConditionsProps {
  place: Place
  current: CurrentWeather
  today?: DailyPoint
  /** Extra control rendered next to the place name (e.g. a "save city" button). */
  action?: ReactNode
}

export function CurrentConditions({ place, current, today, action }: CurrentConditionsProps) {
  const { t } = useTranslation('weather')
  const { t: tLocation } = useTranslation('location')
  const { formatTemperature, formatWindSpeed } = useUnits()
  const format = useFormatters()
  const describe = useWeatherDescription()
  const titleId = useId()

  const name = place.isCurrentLocation ? tLocation('currentPlace') : place.name
  const subtitle = place.isCurrentLocation
    ? format.coordinates(place.latitude, place.longitude)
    : [place.region, place.country].filter(Boolean).join(', ')

  return (
    <Card labelledBy={titleId} className={styles.card}>
      <div className={styles.top}>
        <div>
          <div className={styles.heading}>
            <h2 id={titleId} className={styles.place}>
              {name}
            </h2>
            {action}
          </div>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          <p className={styles.updated}>
            <Trans
              t={t}
              i18nKey="updatedAt"
              values={{ time: format.localTime(current.time) }}
              components={{ time: <time dateTime={current.time} /> }}
            />
          </p>
        </div>
        <WeatherIcon
          code={current.weatherCode}
          isDay={current.isDay}
          size={96}
          className={styles.icon}
        />
      </div>

      <div className={styles.now}>
        <p className={styles.temperature}>
          <span className="sr-only">{t('currentTemperature')} </span>
          {formatTemperature(current.temperature)}
        </p>
        <div>
          <p className={styles.description}>{describe(current.weatherCode)}</p>
          <p className={styles.feelsLike}>
            {t('feelsLike', { value: formatTemperature(current.apparentTemperature) })}
          </p>
          {today && (
            <p className={styles.range}>
              {t('todayRange', {
                max: formatTemperature(today.temperatureMax),
                min: formatTemperature(today.temperatureMin),
              })}
            </p>
          )}
        </div>
      </div>

      <dl className={styles.details}>
        <div className={styles.detail}>
          <dt>{t('humidity')}</dt>
          <dd>{format.percent(current.humidity)}</dd>
        </div>
        <div className={styles.detail}>
          <dt>{t('wind')}</dt>
          <dd>
            {formatWindSpeed(current.windSpeed)}{' '}
            <span
              className={styles.muted}
              title={t('windDirection', { degrees: current.windDirection })}
            >
              {format.compass(current.windDirection)}
            </span>
          </dd>
        </div>
        <div className={styles.detail}>
          <dt>{t('uvIndex')}</dt>
          <dd>
            {format.integer(current.uvIndex)}{' '}
            <span className={styles.uvBadge} data-level={getUvLevel(current.uvIndex)}>
              {format.uvLabel(current.uvIndex)}
            </span>
          </dd>
        </div>
        <div className={styles.detail}>
          <dt>{t('precipitation')}</dt>
          <dd>{format.precipitation(current.precipitation)}</dd>
        </div>
      </dl>
    </Card>
  )
}
