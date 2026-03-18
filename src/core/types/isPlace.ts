import type { Place } from './place'

const isOptionalString = (value: unknown) => value === undefined || typeof value === 'string'

/** Runtime guard for places read back from `localStorage`. */
export function isPlace(value: unknown): value is Place {
  if (typeof value !== 'object' || value === null) return false
  const place = value as Record<string, unknown>
  return (
    typeof place.id === 'string' &&
    typeof place.name === 'string' &&
    typeof place.latitude === 'number' &&
    Number.isFinite(place.latitude) &&
    typeof place.longitude === 'number' &&
    Number.isFinite(place.longitude) &&
    isOptionalString(place.region) &&
    isOptionalString(place.country) &&
    isOptionalString(place.countryCode)
  )
}

export function isPlaceList(value: unknown): value is Place[] {
  return Array.isArray(value) && value.every(isPlace)
}
