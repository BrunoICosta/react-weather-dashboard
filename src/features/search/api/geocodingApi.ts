import { buildUrl, fetchJson } from '@/core/api/http'
import type { Place } from '@/core/types/place'

export const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

export const MIN_QUERY_LENGTH = 2

export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  country_code?: string
  admin1?: string
}

export interface GeocodingResponse {
  /** Omitted by the API when nothing matches. */
  results?: GeocodingResult[]
}

export function toPlace(result: GeocodingResult): Place {
  return {
    id: String(result.id),
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    region: result.admin1,
    country: result.country,
    countryCode: result.country_code,
  }
}

/** Language codes accepted by the geocoding API (ISO 639-1). */
export type GeocodingLanguage = 'pt' | 'en'

/** Searches cities by name; place and country names come back in `language`. */
export async function searchPlaces(
  query: string,
  language: GeocodingLanguage,
  signal?: AbortSignal,
): Promise<Place[]> {
  const name = query.trim()
  if (name.length < MIN_QUERY_LENGTH) return []

  const url = buildUrl(GEOCODING_URL, { name, count: 8, language, format: 'json' })
  const response = await fetchJson<GeocodingResponse>(url, { signal })
  return (response.results ?? []).map(toPlace)
}
