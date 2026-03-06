/** Broad weather condition used to choose icons and the dashboard theme. */
export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm'

interface WeatherCodeInfo {
  description: string
  condition: WeatherCondition
}

/**
 * WMO weather interpretation codes used by Open-Meteo.
 * @see https://open-meteo.com/en/docs (section "WMO Weather interpretation codes")
 */
const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { description: 'Céu limpo', condition: 'clear' },
  1: { description: 'Predominantemente limpo', condition: 'clear' },
  2: { description: 'Parcialmente nublado', condition: 'partly-cloudy' },
  3: { description: 'Nublado', condition: 'cloudy' },
  45: { description: 'Neblina', condition: 'fog' },
  48: { description: 'Neblina com geada', condition: 'fog' },
  51: { description: 'Garoa fraca', condition: 'drizzle' },
  53: { description: 'Garoa moderada', condition: 'drizzle' },
  55: { description: 'Garoa intensa', condition: 'drizzle' },
  56: { description: 'Garoa congelante fraca', condition: 'drizzle' },
  57: { description: 'Garoa congelante intensa', condition: 'drizzle' },
  61: { description: 'Chuva fraca', condition: 'rain' },
  63: { description: 'Chuva moderada', condition: 'rain' },
  65: { description: 'Chuva forte', condition: 'rain' },
  66: { description: 'Chuva congelante fraca', condition: 'rain' },
  67: { description: 'Chuva congelante forte', condition: 'rain' },
  71: { description: 'Neve fraca', condition: 'snow' },
  73: { description: 'Neve moderada', condition: 'snow' },
  75: { description: 'Neve forte', condition: 'snow' },
  77: { description: 'Grãos de neve', condition: 'snow' },
  80: { description: 'Pancadas de chuva fracas', condition: 'rain' },
  81: { description: 'Pancadas de chuva moderadas', condition: 'rain' },
  82: { description: 'Pancadas de chuva violentas', condition: 'rain' },
  85: { description: 'Pancadas de neve fracas', condition: 'snow' },
  86: { description: 'Pancadas de neve fortes', condition: 'snow' },
  95: { description: 'Trovoada', condition: 'thunderstorm' },
  96: { description: 'Trovoada com granizo fraco', condition: 'thunderstorm' },
  99: { description: 'Trovoada com granizo forte', condition: 'thunderstorm' },
}

const UNKNOWN: WeatherCodeInfo = { description: 'Condição desconhecida', condition: 'cloudy' }

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return WEATHER_CODES[code] ?? UNKNOWN
}

export function getWeatherDescription(code: number): string {
  return getWeatherInfo(code).description
}

export function getWeatherCondition(code: number): WeatherCondition {
  return getWeatherInfo(code).condition
}
