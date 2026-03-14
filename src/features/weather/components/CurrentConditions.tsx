import type { Place } from '@/core/types/place'
import {
  formatCoordinates,
  formatLocalTime,
  formatPercent,
  formatPrecipitation,
  getUvLevel,
  toCompassPoint,
} from '@/shared/lib/format'
import { useUnits } from '@/features/settings/units/unitsContext'
import { getWeatherDescription } from '../lib/weatherCodes'
import type { CurrentWeather, DailyPoint } from '../types'
import styles from './CurrentConditions.module.css'
import { WeatherIcon } from './WeatherIcon'

interface CurrentConditionsProps {
  place: Place
  current: CurrentWeather
  today?: DailyPoint
}

export function CurrentConditions({ place, current, today }: CurrentConditionsProps) {
  const { formatTemperature, formatWindSpeed } = useUnits()
  const description = getWeatherDescription(current.weatherCode)
  const uv = getUvLevel(current.uvIndex)
  const subtitle = place.isCurrentLocation
    ? formatCoordinates(place.latitude, place.longitude)
    : [place.region, place.country].filter(Boolean).join(', ')

  return (
    <section className={styles.card} aria-labelledby="current-title">
      <div className={styles.top}>
        <div>
          <h2 id="current-title" className={styles.place}>
            {place.name}
          </h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          <p className={styles.updated}>
            Atualizado às <time>{formatLocalTime(current.time)}</time> (horário local)
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
          <span className="sr-only">Temperatura atual: </span>
          {formatTemperature(current.temperature)}
        </p>
        <div>
          <p className={styles.description}>{description}</p>
          <p className={styles.feelsLike}>
            Sensação térmica {formatTemperature(current.apparentTemperature)}
          </p>
          {today && (
            <p className={styles.range}>
              Máx. {formatTemperature(today.temperatureMax)} · Mín.{' '}
              {formatTemperature(today.temperatureMin)}
            </p>
          )}
        </div>
      </div>

      <dl className={styles.details}>
        <div className={styles.detail}>
          <dt>Umidade</dt>
          <dd>{formatPercent(current.humidity)}</dd>
        </div>
        <div className={styles.detail}>
          <dt>Vento</dt>
          <dd>
            {formatWindSpeed(current.windSpeed)}{' '}
            <span className={styles.muted} title={`Direção: ${current.windDirection}°`}>
              {toCompassPoint(current.windDirection)}
            </span>
          </dd>
        </div>
        <div className={styles.detail}>
          <dt>Índice UV</dt>
          <dd>
            {Math.round(current.uvIndex)}{' '}
            <span className={styles.uvBadge} data-level={uv.level}>
              {uv.label}
            </span>
          </dd>
        </div>
        <div className={styles.detail}>
          <dt>Precipitação</dt>
          <dd>{formatPrecipitation(current.precipitation)}</dd>
        </div>
      </dl>
    </section>
  )
}
