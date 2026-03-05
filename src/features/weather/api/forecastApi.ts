import { buildUrl, fetchJson } from '@/core/api/http'
import type { Forecast } from '../types'
import { mapForecast } from './mapForecast'

export const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

const CURRENT_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'wind_speed_10m',
  'wind_direction_10m',
  'weather_code',
  'is_day',
  'uv_index',
  'precipitation',
] as const

const HOURLY_FIELDS = [
  'temperature_2m',
  'precipitation_probability',
  'weather_code',
  'is_day',
] as const

const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_probability_max',
  'sunrise',
  'sunset',
  'uv_index_max',
] as const

type Series<K extends string, V> = { time: string[] } & Record<K, V[]>

/** Raw response shape for the fields requested above. */
export interface ForecastResponse {
  timezone: string
  utc_offset_seconds: number
  current: { time: string } & Record<(typeof CURRENT_FIELDS)[number], number>
  hourly: Series<'temperature_2m' | 'weather_code' | 'is_day', number> &
    Series<'precipitation_probability', number | null>
  daily: Series<
    'weather_code' | 'temperature_2m_max' | 'temperature_2m_min' | 'uv_index_max',
    number
  > &
    Series<'precipitation_probability_max', number | null> &
    Series<'sunrise' | 'sunset', string>
}

export interface Coordinates {
  latitude: number
  longitude: number
}

/**
 * Fetches current conditions, hourly and daily forecast in a single request.
 * Values always come in metric units (°C, km/h); unit preferences are applied on the client,
 * so toggling them never triggers a new request.
 */
export async function fetchForecast(
  { latitude, longitude }: Coordinates,
  signal?: AbortSignal,
): Promise<Forecast> {
  const url = buildUrl(FORECAST_URL, {
    latitude: latitude.toFixed(4),
    longitude: longitude.toFixed(4),
    timezone: 'auto',
    forecast_days: 7,
    current: CURRENT_FIELDS.join(','),
    hourly: HOURLY_FIELDS.join(','),
    daily: DAILY_FIELDS.join(','),
  })

  const response = await fetchJson<ForecastResponse>(url, { signal })
  return mapForecast(response)
}
