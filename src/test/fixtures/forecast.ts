import type { ForecastResponse } from '@/features/weather/api/forecastApi'

const pad = (value: number) => String(value).padStart(2, '0')

function isoDate(day: number): string {
  return `2026-03-${pad(day)}`
}

interface ForecastFixtureOptions {
  currentTime?: string
  temperature?: number
  weatherCode?: number
  isDay?: boolean
}

/**
 * Builds a realistic Open-Meteo payload: 7 days starting on 2026-03-10, hourly data from
 * midnight of the first day, temperatures following a simple daily curve.
 */
export function buildForecastResponse({
  currentTime = '2026-03-10T14:15',
  temperature = 27.4,
  weatherCode = 2,
  isDay = true,
}: ForecastFixtureOptions = {}): ForecastResponse {
  const days = Array.from({ length: 7 }, (_, i) => isoDate(10 + i))
  const hours = days.flatMap((date) => Array.from({ length: 24 }, (_, h) => `${date}T${pad(h)}:00`))

  return {
    timezone: 'America/Sao_Paulo',
    utc_offset_seconds: -10800,
    current: {
      time: currentTime,
      temperature_2m: temperature,
      apparent_temperature: temperature + 1.8,
      relative_humidity_2m: 64,
      wind_speed_10m: 12.6,
      wind_direction_10m: 135,
      weather_code: weatherCode,
      is_day: isDay ? 1 : 0,
      uv_index: 6.4,
      precipitation: 0,
    },
    hourly: {
      time: hours,
      temperature_2m: hours.map((_, i) => 20 + Math.round(6 * Math.sin(((i % 24) - 9) / 4))),
      precipitation_probability: hours.map((_, i) => (i % 24 >= 15 && i % 24 <= 19 ? 70 : 10)),
      weather_code: hours.map((_, i) => (i % 24 >= 15 && i % 24 <= 19 ? 61 : 1)),
      is_day: hours.map((_, i) => (i % 24 >= 6 && i % 24 < 18 ? 1 : 0)),
    },
    daily: {
      time: days,
      weather_code: [2, 61, 63, 3, 0, 95, 1],
      temperature_2m_max: [29.6, 26.1, 24.8, 25.3, 28.2, 30.4, 27.9],
      temperature_2m_min: [19.2, 18.4, 17.9, 17.1, 18.6, 20.3, 19.5],
      precipitation_probability_max: [20, 80, 90, 35, 5, 75, null],
      sunrise: days.map((date) => `${date}T06:05`),
      sunset: days.map((date) => `${date}T18:32`),
      uv_index_max: [9.1, 5.4, 4.2, 7.3, 10.2, 8.8, 9.6],
    },
  }
}
