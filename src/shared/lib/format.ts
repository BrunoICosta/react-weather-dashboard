const integer = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 })
const oneDecimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })
const twoDecimals = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const formatDecimal2 = (value: number) => twoDecimals.format(value)

export function formatInteger(value: number): string {
  // Avoids rendering "-0" for values like -0.3.
  const rounded = Math.round(value)
  return integer.format(rounded === 0 ? 0 : rounded)
}

export function formatDecimal(value: number): string {
  return oneDecimal.format(value)
}

export function formatPercent(value: number): string {
  return `${formatInteger(value)}%`
}

export function formatTemperature(celsius: number): string {
  return `${formatInteger(celsius)}°`
}

export function formatWindSpeed(kmh: number): string {
  return `${formatInteger(kmh)} km/h`
}

export function formatPrecipitation(mm: number): string {
  return `${formatDecimal(mm)} mm`
}

const COMPASS_POINTS = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'] as const

/** Converts degrees into a pt-BR compass point (L = leste, O = oeste). */
export function toCompassPoint(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360
  return COMPASS_POINTS[Math.round(normalized / 45) % COMPASS_POINTS.length]
}

export interface UvLevel {
  label: string
  level: 'low' | 'moderate' | 'high' | 'very-high' | 'extreme'
}

/** WHO UV index categories. */
export function getUvLevel(index: number): UvLevel {
  if (index < 3) return { label: 'Baixo', level: 'low' }
  if (index < 6) return { label: 'Moderado', level: 'moderate' }
  if (index < 8) return { label: 'Alto', level: 'high' }
  if (index < 11) return { label: 'Muito alto', level: 'very-high' }
  return { label: 'Extremo', level: 'extreme' }
}

/** Formats coordinates as `23,55° S, 46,64° O` (pt-BR hemispheres). */
export function formatCoordinates(latitude: number, longitude: number): string {
  const lat = `${formatDecimal2(Math.abs(latitude))}° ${latitude < 0 ? 'S' : 'N'}`
  const lon = `${formatDecimal2(Math.abs(longitude))}° ${longitude < 0 ? 'O' : 'L'}`
  return `${lat}, ${lon}`
}

/** `2026-03-05T15:00` → `15h`. */
export function formatHour(isoDateTime: string): string {
  return `${isoDateTime.slice(11, 13)}h`
}

/** Extracts `HH:mm` from a local ISO date-time without going through `Date` (no timezone shift). */
export function formatLocalTime(isoDateTime: string): string {
  return isoDateTime.slice(11, 16)
}
