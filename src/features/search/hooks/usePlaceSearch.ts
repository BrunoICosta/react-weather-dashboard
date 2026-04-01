import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { normalizeLanguage } from '@/i18n/config'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { MIN_QUERY_LENGTH, searchPlaces, type GeocodingLanguage } from '../api/geocodingApi'

const DAY = 24 * 60 * 60_000

export const placeSearchKeys = {
  all: ['places'] as const,
  search: (term: string, language: GeocodingLanguage) =>
    [...placeSearchKeys.all, language, term] as const,
}

/** Normalizes what the user typed into the term that is debounced and cached. */
export function toSearchTerm(query: string, locale: string): string {
  return query.trim().toLocaleLowerCase(locale)
}

/**
 * Debounced city autocomplete. City names do not change, so results are cached for a day
 * (per language) and the previous list stays visible while the next one loads.
 */
export function usePlaceSearch(query: string, debounceMs = 350) {
  const { i18n } = useTranslation()
  const locale = normalizeLanguage(i18n.resolvedLanguage)
  const language: GeocodingLanguage = locale === 'pt-BR' ? 'pt' : 'en'
  const term = useDebouncedValue(toSearchTerm(query, locale), debounceMs)
  const enabled = term.length >= MIN_QUERY_LENGTH

  const result = useQuery({
    queryKey: placeSearchKeys.search(term, language),
    queryFn: ({ signal }) => searchPlaces(term, language, signal),
    enabled,
    staleTime: DAY,
    gcTime: DAY,
    placeholderData: keepPreviousData,
  })

  return { ...result, term, enabled, locale }
}
