export type TemperatureUnit = 'celsius' | 'fahrenheit'
export type WindSpeedUnit = 'kmh' | 'mph'

export const TEMPERATURE_UNITS: readonly TemperatureUnit[] = ['celsius', 'fahrenheit']
export const WIND_SPEED_UNITS: readonly WindSpeedUnit[] = ['kmh', 'mph']

export const TEMPERATURE_SYMBOL: Record<TemperatureUnit, string> = {
  celsius: '°C',
  fahrenheit: '°F',
}

export const WIND_SPEED_SYMBOL: Record<WindSpeedUnit, string> = {
  kmh: 'km/h',
  mph: 'mph',
}

const KM_PER_MILE = 1.609344

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

export function kmhToMph(kmh: number): number {
  return kmh / KM_PER_MILE
}

/** Converts a value that the API returns in °C. */
export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  return unit === 'fahrenheit' ? celsiusToFahrenheit(celsius) : celsius
}

/** Converts a value that the API returns in km/h. */
export function convertWindSpeed(kmh: number, unit: WindSpeedUnit): number {
  return unit === 'mph' ? kmhToMph(kmh) : kmh
}

export function isTemperatureUnit(value: unknown): value is TemperatureUnit {
  return TEMPERATURE_UNITS.includes(value as TemperatureUnit)
}

export function isWindSpeedUnit(value: unknown): value is WindSpeedUnit {
  return WIND_SPEED_UNITS.includes(value as WindSpeedUnit)
}
