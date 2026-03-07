import { queryOptions } from '@tanstack/react-query'
import { fetchForecast, type Coordinates } from './forecastApi'

const MINUTE = 60_000

/** ~1 km precision: nearby coordinates share the same cache entry. */
export function roundCoordinate(value: number): number {
  return Math.round(value * 100) / 100
}

export const forecastKeys = {
  all: ['forecast'] as const,
  byCoordinates: ({ latitude, longitude }: Coordinates) =>
    [...forecastKeys.all, roundCoordinate(latitude), roundCoordinate(longitude)] as const,
}

/**
 * Shared query definition, used by `useQuery` and by `prefetchQuery` (e.g. on saved cities hover).
 * Open-Meteo refreshes its models roughly every hour and current conditions every 15 minutes,
 * so data younger than 10 minutes is considered fresh.
 */
export function forecastQueryOptions(coordinates: Coordinates) {
  const rounded = {
    latitude: roundCoordinate(coordinates.latitude),
    longitude: roundCoordinate(coordinates.longitude),
  }
  return queryOptions({
    queryKey: forecastKeys.byCoordinates(rounded),
    queryFn: ({ signal }) => fetchForecast(rounded, signal),
    staleTime: 10 * MINUTE,
    refetchInterval: 15 * MINUTE,
  })
}
