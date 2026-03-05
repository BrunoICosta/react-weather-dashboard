import type { DailyPoint, Forecast, HourlyPoint } from '../types'
import type { ForecastResponse } from './forecastApi'

const HOURS_AHEAD = 24

/** Truncates a local ISO date-time (`2026-03-05T14:15`) to the start of its hour. */
export function toHourStart(isoTime: string): string {
  return `${isoTime.slice(0, 13)}:00`
}

/** Converts the column-oriented Open-Meteo payload into row-oriented domain objects. */
export function mapForecast(response: ForecastResponse): Forecast {
  const { current, hourly, daily } = response

  const allHours: HourlyPoint[] = hourly.time.map((time, i) => ({
    time,
    temperature: hourly.temperature_2m[i],
    precipitationProbability: hourly.precipitation_probability[i] ?? 0,
    weatherCode: hourly.weather_code[i],
    isDay: hourly.is_day[i] === 1,
  }))

  // Times are local to the location (timezone=auto) and share the same format, so comparing
  // strings is enough and sidesteps the browser timezone entirely.
  const currentHour = toHourStart(current.time)
  const start = allHours.findIndex((point) => point.time >= currentHour)

  const days: DailyPoint[] = daily.time.map((date, i) => ({
    date,
    weatherCode: daily.weather_code[i],
    temperatureMax: daily.temperature_2m_max[i],
    temperatureMin: daily.temperature_2m_min[i],
    precipitationProbabilityMax: daily.precipitation_probability_max[i] ?? 0,
    sunrise: daily.sunrise[i],
    sunset: daily.sunset[i],
    uvIndexMax: daily.uv_index_max[i],
  }))

  return {
    timezone: response.timezone,
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      weatherCode: current.weather_code,
      isDay: current.is_day === 1,
      uvIndex: current.uv_index,
      precipitation: current.precipitation,
    },
    hourly: start === -1 ? [] : allHours.slice(start, start + HOURS_AHEAD),
    daily: days,
  }
}
