import { useQuery } from '@tanstack/react-query'
import type { Place } from '@/core/types/place'
import { forecastQueryOptions } from '../api/forecastQuery'

export function useForecast(place: Place) {
  return useQuery(forecastQueryOptions(place))
}
