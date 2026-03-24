import { describe, expect, it } from 'vitest'
import { buildForecastResponse } from '@/test/fixtures/forecast'
import { mapForecast, toHourStart } from './mapForecast'

describe('mapForecast', () => {
  it('maps current conditions to domain names', () => {
    const forecast = mapForecast(buildForecastResponse({ temperature: 21, isDay: false }))

    expect(forecast.timezone).toBe('America/Sao_Paulo')
    expect(forecast.current).toMatchObject({
      time: '2026-03-10T14:15',
      temperature: 21,
      apparentTemperature: 22.8,
      humidity: 64,
      windSpeed: 12.6,
      windDirection: 135,
      isDay: false,
    })
  })

  it('returns the next 24 hours starting at the current hour', () => {
    const { hourly } = mapForecast(buildForecastResponse({ currentTime: '2026-03-10T14:45' }))

    expect(hourly).toHaveLength(24)
    expect(hourly[0].time).toBe('2026-03-10T14:00')
    expect(hourly.at(-1)?.time).toBe('2026-03-11T13:00')
  })

  it('returns fewer hours near the end of the forecast range', () => {
    const { hourly } = mapForecast(buildForecastResponse({ currentTime: '2026-03-16T20:00' }))

    expect(hourly.map((point) => point.time)).toEqual([
      '2026-03-16T20:00',
      '2026-03-16T21:00',
      '2026-03-16T22:00',
      '2026-03-16T23:00',
    ])
  })

  it('maps seven days and treats a missing precipitation probability as 0', () => {
    const { daily } = mapForecast(buildForecastResponse())

    expect(daily).toHaveLength(7)
    expect(daily[0]).toMatchObject({
      date: '2026-03-10',
      weatherCode: 2,
      temperatureMax: 29.6,
      temperatureMin: 19.2,
      precipitationProbabilityMax: 20,
    })
    expect(daily[6].precipitationProbabilityMax).toBe(0)
  })
})

describe('toHourStart', () => {
  it('truncates minutes', () => {
    expect(toHourStart('2026-03-10T09:45')).toBe('2026-03-10T09:00')
  })
})
