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

const PT = 'pt-BR'
const EN = 'en'

describe('number formatting', () => {
  it('rounds degrees and never shows negative zero', () => {
    expect(formatDegrees(27.6, PT)).toBe('28°')
    expect(formatDegrees(-0.3, PT)).toBe('0°')
    expect(formatDegrees(-4.6, EN)).toBe('-5°')
  })

  it('formats percentages and precipitation with the locale decimal separator', () => {
    expect(formatPercent(64.4, PT)).toBe('64%')
    expect(formatPrecipitation(1.25, PT)).toBe('1,3 mm')
    expect(formatPrecipitation(1.25, EN)).toBe('1.3 mm')
    expect(formatPrecipitation(0, EN)).toBe('0 mm')
  })

  it('formats coordinates with translated hemispheres', () => {
    const pt = { N: 'N', S: 'S', E: 'L', W: 'O' } as const
    expect(formatCoordinates(-23.5475, -46.63611, PT, (p) => pt[p])).toBe('23,55° S, 46,64° O')
    expect(formatCoordinates(35.6895, 139.69171, EN, (p) => p)).toBe('35.69° N, 139.69° E')
  })
})

describe('toCompassPoint', () => {
  it.each([
    [0, 'N'],
    [44, 'NE'],
    [90, 'E'],
    [135, 'SE'],
    [180, 'S'],
    [225, 'SW'],
    [270, 'W'],
    [338, 'N'],
    [360, 'N'],
    [-90, 'W'],
  ])('%i° → %s', (degrees, expected) => {
    expect(toCompassPoint(degrees)).toBe(expected)
  })
})

describe('getUvLevel', () => {
  it.each([
    [0, 'low'],
    [2.9, 'low'],
    [3, 'moderate'],
    [6.4, 'high'],
    [8, 'very-high'],
    [11, 'extreme'],
  ])('%d → %s', (index, level) => {
    expect(getUvLevel(index)).toBe(level)
  })
})

describe('date formatting', () => {
  it('formats local times per locale without timezone shifts', () => {
    expect(formatLocalTime('2026-03-10T14:15', PT)).toBe('14:15')
    expect(formatLocalTime('2026-03-10T14:15', EN)).toBe('2:15 PM')
    expect(formatHour('2026-03-10T07:00', PT)).toBe('07h')
    expect(formatHour('2026-03-10T15:00', EN)).toBe('3 PM')
  })

  it('formats weekdays and long dates in each language', () => {
    expect(formatWeekday('2026-03-10', PT)).toBe('Ter')
    expect(formatWeekday('2026-03-15', PT)).toBe('Dom')
    expect(formatWeekday('2026-03-10', EN)).toBe('Tue')
    expect(formatLongDate('2026-03-10', PT)).toBe('terça-feira, 10 de março')
    expect(formatLongDate('2026-03-10', EN)).toBe('Tuesday, March 10')
  })
})
