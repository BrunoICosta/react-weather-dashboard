import { http, HttpResponse, type RequestHandler } from 'msw'
import type { GeocodingResult } from '@/features/search/api/geocodingApi'
import { GEOCODING_URL } from '@/features/search/api/geocodingApi'
import { FORECAST_URL } from '@/features/weather/api/forecastApi'
import { buildForecastResponse } from '../fixtures/forecast'

export const geocodingResults: GeocodingResult[] = [
  {
    id: 3464975,
    name: 'Curitiba',
    latitude: -25.42778,
    longitude: -49.27306,
    country: 'Brasil',
    country_code: 'BR',
    admin1: 'Paraná',
  },
  {
    id: 3885509,
    name: 'Curicó',
    latitude: -34.98279,
    longitude: -71.23943,
    country: 'Chile',
    country_code: 'CL',
    admin1: 'Região de Maule',
  },
]

/** Default request handlers shared by every test. Individual tests can override them with `server.use`. */
export const handlers: RequestHandler[] = [
  http.get(FORECAST_URL, () => HttpResponse.json(buildForecastResponse())),
  http.get(GEOCODING_URL, ({ request }) => {
    const name = new URL(request.url).searchParams.get('name')?.toLowerCase() ?? ''
    const results = geocodingResults.filter((result) => result.name.toLowerCase().startsWith(name))
    // Like the real API, `results` is omitted when nothing matches.
    return HttpResponse.json(results.length > 0 ? { results } : {})
  }),
]
