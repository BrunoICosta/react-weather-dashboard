import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { MIN_QUERY_LENGTH, searchPlaces } from '../api/geocodingApi'

const DAY = 24 * 60 * 60_000

export const placeSearchKeys = {
  all: ['places'] as const,
  search: (term: string) => [...placeSearchKeys.all, term] as const,
}

/**
 * Debounced city autocomplete. City names do not change, so results are cached for a day
 * and the previous list stays visible while the next one loads.
 */
export function usePlaceSearch(query: string, debounceMs = 350) {
  const term = useDebouncedValue(query.trim().toLocaleLowerCase('pt-BR'), debounceMs)
  const enabled = term.length >= MIN_QUERY_LENGTH

  const result = useQuery({
    queryKey: placeSearchKeys.search(term),
    queryFn: ({ signal }) => searchPlaces(term, signal),
    enabled,
    staleTime: DAY,
    gcTime: DAY,
    placeholderData: keepPreviousData,
  })

  return { ...result, term, enabled }
}
