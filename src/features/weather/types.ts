export interface CurrentWeather {
  /** Local ISO time of the observation, e.g. `2026-03-05T14:15`. */
  time: string
  /** °C */
  temperature: number
  /** °C */
  apparentTemperature: number
  /** % */
  humidity: number
  /** km/h */
  windSpeed: number
  /** Degrees, meteorological convention (direction the wind comes from). */
  windDirection: number
  weatherCode: number
  isDay: boolean
  uvIndex: number
  /** mm */
  precipitation: number
}

export interface HourlyPoint {
  /** Local ISO time, e.g. `2026-03-05T15:00`. */
  time: string
  /** °C */
  temperature: number
  /** 0–100 */
  precipitationProbability: number
  weatherCode: number
  isDay: boolean
}

export interface DailyPoint {
  /** Local ISO date, e.g. `2026-03-05`. */
  date: string
  weatherCode: number
  /** °C */
  temperatureMax: number
  /** °C */
  temperatureMin: number
  /** 0–100 */
  precipitationProbabilityMax: number
  sunrise: string
  sunset: string
  uvIndexMax: number
}

export interface Forecast {
  timezone: string
  current: CurrentWeather
  /** The next 24 hours starting at the current hour. */
  hourly: HourlyPoint[]
  /** Seven days starting today. */
  daily: DailyPoint[]
}
