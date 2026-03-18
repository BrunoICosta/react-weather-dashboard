import { useCallback } from 'react'
import { isPlaceList } from '@/core/types/isPlace'
import type { Place } from '@/core/types/place'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'

export const MAX_SAVED_CITIES = 8

const EMPTY: Place[] = []

/** Pure helpers, exported for unit tests. */
export function addCity(cities: Place[], place: Place): Place[] {
  if (cities.some((city) => city.id === place.id)) return cities
  // Newest first; the oldest entry is dropped once the limit is reached.
  return [place, ...cities].slice(0, MAX_SAVED_CITIES)
}

export function removeCity(cities: Place[], id: string): Place[] {
  return cities.filter((city) => city.id !== id)
}

export function useSavedCities() {
  const [cities, setCities] = useLocalStorage<Place[]>('saved-cities', EMPTY, isPlaceList)

  const save = useCallback(
    (place: Place) => setCities((current) => addCity(current, place)),
    [setCities],
  )
  const remove = useCallback(
    (id: string) => setCities((current) => removeCity(current, id)),
    [setCities],
  )
  const isSaved = useCallback((id: string) => cities.some((city) => city.id === id), [cities])

  return { cities, save, remove, isSaved }
}
