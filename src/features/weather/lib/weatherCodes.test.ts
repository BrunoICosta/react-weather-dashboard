import { describe, expect, it } from 'vitest'
import { getWeatherCondition, getWeatherDescription } from './weatherCodes'

describe('weather codes', () => {
  it('describes WMO codes in Portuguese', () => {
    expect(getWeatherDescription(0)).toBe('Céu limpo')
    expect(getWeatherDescription(63)).toBe('Chuva moderada')
    expect(getWeatherDescription(99)).toBe('Trovoada com granizo forte')
  })

  it('groups codes into broad conditions', () => {
    expect(getWeatherCondition(1)).toBe('clear')
    expect(getWeatherCondition(2)).toBe('partly-cloudy')
    expect(getWeatherCondition(48)).toBe('fog')
    expect(getWeatherCondition(55)).toBe('drizzle')
    expect(getWeatherCondition(81)).toBe('rain')
    expect(getWeatherCondition(86)).toBe('snow')
    expect(getWeatherCondition(95)).toBe('thunderstorm')
  })

  it('falls back gracefully for unknown codes', () => {
    expect(getWeatherDescription(42)).toBe('Condição desconhecida')
    expect(getWeatherCondition(42)).toBe('cloudy')
  })
})
