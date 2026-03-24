import { describe, expect, it } from 'vitest'
import {
  formatCoordinates,
  formatDegrees,
  formatHour,
  formatLocalTime,
  formatLongDate,
  formatPercent,
  formatPrecipitation,
  formatWeekday,
  getUvLevel,
  toCompassPoint,
} from './format'

describe('number formatting', () => {
  it('rounds degrees and never shows negative zero', () => {
    expect(formatDegrees(27.6)).toBe('28°')
    expect(formatDegrees(-0.3)).toBe('0°')
    expect(formatDegrees(-4.6)).toBe('-5°')
  })

  it('formats percentages and precipitation with pt-BR decimals', () => {
    expect(formatPercent(64.4)).toBe('64%')
    expect(formatPrecipitation(1.25)).toBe('1,3 mm')
    expect(formatPrecipitation(0)).toBe('0 mm')
  })

  it('formats coordinates with pt-BR hemispheres', () => {
    expect(formatCoordinates(-23.5475, -46.63611)).toBe('23,55° S, 46,64° O')
    expect(formatCoordinates(35.6895, 139.69171)).toBe('35,69° N, 139,69° L')
  })
})

describe('toCompassPoint', () => {
  it.each([
    [0, 'N'],
    [44, 'NE'],
    [90, 'L'],
    [135, 'SE'],
    [180, 'S'],
    [225, 'SO'],
    [270, 'O'],
    [338, 'N'],
    [360, 'N'],
    [-90, 'O'],
  ])('%i° → %s', (degrees, expected) => {
    expect(toCompassPoint(degrees)).toBe(expected)
  })
})

describe('getUvLevel', () => {
  it.each([
    [0, 'Baixo'],
    [2.9, 'Baixo'],
    [3, 'Moderado'],
    [6.4, 'Alto'],
    [8, 'Muito alto'],
    [11, 'Extremo'],
  ])('%d → %s', (index, label) => {
    expect(getUvLevel(index).label).toBe(label)
  })
})

describe('date formatting', () => {
  it('reads times straight from the local ISO string', () => {
    expect(formatLocalTime('2026-03-10T14:15')).toBe('14:15')
    expect(formatHour('2026-03-10T07:00')).toBe('07h')
  })

  it('formats weekdays without shifting the day across timezones', () => {
    expect(formatWeekday('2026-03-10')).toBe('Ter')
    expect(formatWeekday('2026-03-15')).toBe('Dom')
    expect(formatLongDate('2026-03-10')).toBe('terça-feira, 10 de março')
  })
})
