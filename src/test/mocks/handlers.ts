import { http, HttpResponse, type RequestHandler } from 'msw'
import { FORECAST_URL } from '@/features/weather/api/forecastApi'
import { buildForecastResponse } from '../fixtures/forecast'

/** Default request handlers shared by every test. Individual tests can override them with `server.use`. */
export const handlers: RequestHandler[] = [
  http.get(FORECAST_URL, () => HttpResponse.json(buildForecastResponse())),
]
