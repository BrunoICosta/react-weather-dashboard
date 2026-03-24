import { describe, expect, it } from 'vitest'
import {
  celsiusToFahrenheit,
  convertTemperature,
  convertWindSpeed,
  isTemperatureUnit,
  isWindSpeedUnit,
  kmhToMph,
} from './units'

describe('units', () => {
  it('converts celsius to fahrenheit', () => {
    expect(celsiusToFahrenheit(0)).toBe(32)
    expect(celsiusToFahrenheit(100)).toBe(212)
    expect(celsiusToFahrenheit(-40)).toBe(-40)
  })

  it('converts km/h to mph', () => {
    expect(kmhToMph(1.609344)).toBeCloseTo(1)
    expect(kmhToMph(100)).toBeCloseTo(62.137, 3)
  })

  it('keeps metric values untouched for metric units', () => {
    expect(convertTemperature(21.5, 'celsius')).toBe(21.5)
    expect(convertWindSpeed(12, 'kmh')).toBe(12)
    expect(convertTemperature(25, 'fahrenheit')).toBe(77)
    expect(convertWindSpeed(16.09344, 'mph')).toBeCloseTo(10)
  })

  it('validates persisted unit values', () => {
    expect(isTemperatureUnit('fahrenheit')).toBe(true)
    expect(isTemperatureUnit('kelvin')).toBe(false)
    expect(isWindSpeedUnit('mph')).toBe(true)
    expect(isWindSpeedUnit(null)).toBe(false)
  })
})
