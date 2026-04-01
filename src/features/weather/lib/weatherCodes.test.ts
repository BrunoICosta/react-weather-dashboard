import { describe, expect, it } from 'vitest'
import { i18n } from '@/i18n/config'
import { getWeatherCondition, getWeatherDescriptionKey } from './weatherCodes'

const describeIn = (language: 'pt-BR' | 'en', code: number) =>
  i18n.getFixedT(language, 'weather')(getWeatherDescriptionKey(code))

describe('weather codes', () => {
  it('describes WMO codes in Portuguese and English', () => {
    expect(describeIn('pt-BR', 0)).toBe('Céu limpo')
    expect(describeIn('pt-BR', 63)).toBe('Chuva moderada')
    expect(describeIn('pt-BR', 99)).toBe('Trovoada com granizo forte')
    expect(describeIn('en', 0)).toBe('Clear sky')
    expect(describeIn('en', 63)).toBe('Moderate rain')
    expect(describeIn('en', 99)).toBe('Thunderstorm with heavy hail')
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
    expect(getWeatherDescriptionKey(42)).toBe('codes.unknown')
    expect(describeIn('pt-BR', 42)).toBe('Condição desconhecida')
    expect(describeIn('en', 42)).toBe('Unknown conditions')
    expect(getWeatherCondition(42)).toBe('cloudy')
  })
})
