import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

/** Broad weather condition used to choose icons and the dashboard theme. */
export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm'

/**
 * WMO weather interpretation codes used by Open-Meteo. Descriptions live in the `weather` namespace
 * (`codes.<code>`) of each locale.
 * @see https://open-meteo.com/en/docs (section "WMO Weather interpretation codes")
 */
const WEATHER_CODES = {
  0: 'clear',
  1: 'clear',
  2: 'partly-cloudy',
  3: 'cloudy',
  45: 'fog',
  48: 'fog',
  51: 'drizzle',
  53: 'drizzle',
  55: 'drizzle',
  56: 'drizzle',
  57: 'drizzle',
  61: 'rain',
  63: 'rain',
  65: 'rain',
  66: 'rain',
  67: 'rain',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  77: 'snow',
  80: 'rain',
  81: 'rain',
  82: 'rain',
  85: 'snow',
  86: 'snow',
  95: 'thunderstorm',
  96: 'thunderstorm',
  99: 'thunderstorm',
} as const satisfies Record<number, WeatherCondition>

export type WeatherCode = keyof typeof WEATHER_CODES

export function isKnownWeatherCode(code: number): code is WeatherCode {
  return Object.hasOwn(WEATHER_CODES, code)
}

export function getWeatherCondition(code: number): WeatherCondition {
  return isKnownWeatherCode(code) ? WEATHER_CODES[code] : 'cloudy'
}

/** Translation key (in the `weather` namespace) describing a WMO code. */
export function getWeatherDescriptionKey(code: number): `codes.${WeatherCode | 'unknown'}` {
  return isKnownWeatherCode(code) ? `codes.${code}` : 'codes.unknown'
}

/** Returns a function that describes a WMO code in the active language. */
export function useWeatherDescription() {
  const { t } = useTranslation('weather')
  return useCallback((code: number) => t(getWeatherDescriptionKey(code)), [t])
}
