/**
 * Locale-aware formatting helpers. They are pure (the locale is always an argument) so they are
 * easy to test; components get pre-bound versions from `useFormatters`.
 */

const numberFormats = new Map<string, Intl.NumberFormat>()
const dateFormats = new Map<string, Intl.DateTimeFormat>()

function numberFormat(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${locale}|${JSON.stringify(options)}`
  let format = numberFormats.get(key)
  if (!format) {
    format = new Intl.NumberFormat(locale, options)
    numberFormats.set(key, format)
  }
  return format
}

/** Local ISO values carry no offset, so they are formatted as UTC to never shift the day/hour. */
function dateFormat(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`
  let format = dateFormats.get(key)
  if (!format) {
    format = new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' })
    dateFormats.set(key, format)
  }
  return format
}

export function formatInteger(value: number, locale: string): string {
  // Avoids rendering "-0" for values like -0.3.
  const rounded = Math.round(value)
  return numberFormat(locale, { maximumFractionDigits: 0 }).format(rounded === 0 ? 0 : rounded)
}

export function formatDecimal(value: number, locale: string): string {
  return numberFormat(locale, { maximumFractionDigits: 1 }).format(value)
}

export function formatPercent(value: number, locale: string): string {
  return `${formatInteger(value, locale)}%`
}

/** Formats an already converted temperature as `27°`. */
export function formatDegrees(value: number, locale: string): string {
  return `${formatInteger(value, locale)}°`
}

export function formatPrecipitation(mm: number, locale: string): string {
  return `${formatDecimal(mm, locale)} mm`
}

export const COMPASS_POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const
export type CompassPoint = (typeof COMPASS_POINTS)[number]

/** Converts degrees into a compass point code; the label is translated by the caller. */
export function toCompassPoint(degrees: number): CompassPoint {
  const normalized = ((degrees % 360) + 360) % 360
  return COMPASS_POINTS[Math.round(normalized / 45) % COMPASS_POINTS.length]
}

export type UvLevel = 'low' | 'moderate' | 'high' | 'very-high' | 'extreme'

/** WHO UV index categories. */
export function getUvLevel(index: number): UvLevel {
  if (index < 3) return 'low'
  if (index < 6) return 'moderate'
  if (index < 8) return 'high'
  if (index < 11) return 'very-high'
  return 'extreme'
}

/** Formats coordinates as `23,55° S, 46,64° O` (pt-BR) or `23.55° S, 46.64° W` (en). */
export function formatCoordinates(
  latitude: number,
  longitude: number,
  locale: string,
  compassLabel: (point: 'N' | 'S' | 'E' | 'W') => string,
): string {
  const format = numberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const lat = `${format.format(Math.abs(latitude))}° ${compassLabel(latitude < 0 ? 'S' : 'N')}`
  const lon = `${format.format(Math.abs(longitude))}° ${compassLabel(longitude < 0 ? 'W' : 'E')}`
  return `${lat}, ${lon}`
}

/** Parses a local ISO date (`2026-03-05`) or date-time (`2026-03-05T14:15`) as UTC. */
function parseLocal(iso: string): Date {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number)
  const hours = iso.length > 10 ? Number(iso.slice(11, 13)) : 0
  const minutes = iso.length > 13 ? Number(iso.slice(14, 16)) : 0
  return new Date(Date.UTC(year, month - 1, day, hours, minutes))
}

/** `2026-03-05` → `Qui` (pt-BR) / `Thu` (en) */
export function formatWeekday(isoDate: string, locale: string): string {
  const weekday = dateFormat(locale, { weekday: 'short' }).format(parseLocal(isoDate))
  const clean = weekday.replace('.', '')
  return clean.charAt(0).toLocaleUpperCase(locale) + clean.slice(1)
}

/** `2026-03-05` → `quinta-feira, 5 de março` (pt-BR) / `Thursday, March 5` (en) */
export function formatLongDate(isoDate: string, locale: string): string {
  return dateFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(
    parseLocal(isoDate),
  )
}

/** `2026-03-05T15:00` → `15h` (pt-BR, the usual Brazilian notation) / `3 PM` (en). */
export function formatHour(isoDateTime: string, locale: string): string {
  if (locale.startsWith('pt')) return `${isoDateTime.slice(11, 13)}h`
  return dateFormat(locale, { hour: 'numeric' }).format(parseLocal(isoDateTime))
}

/** `2026-03-05T14:15` → `14:15` (pt-BR) / `2:15 PM` (en). */
export function formatLocalTime(isoDateTime: string, locale: string): string {
  return dateFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(parseLocal(isoDateTime))
}
