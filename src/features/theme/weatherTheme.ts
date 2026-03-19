import { getWeatherCondition } from '@/features/weather/lib/weatherCodes'

export type WeatherScene = 'clear' | 'cloudy' | 'fog' | 'rain' | 'storm' | 'snow'
export type DayPeriod = 'day' | 'night'
export type Tone = 'light' | 'dark'

export interface WeatherTheme {
  scene: WeatherScene
  period: DayPeriod
  /** Dark surfaces at night and during storms; light otherwise. */
  tone: Tone
  /** Used for `<meta name="theme-color">` (mobile browser chrome). */
  themeColor: string
}

const SCENE_BY_CONDITION = {
  clear: 'clear',
  'partly-cloudy': 'clear',
  cloudy: 'cloudy',
  fog: 'fog',
  drizzle: 'rain',
  rain: 'rain',
  thunderstorm: 'storm',
  snow: 'snow',
} as const satisfies Record<ReturnType<typeof getWeatherCondition>, WeatherScene>

/** Top color of each background gradient (kept in sync with `theme.css`). */
const THEME_COLORS: Record<`${WeatherScene}-${DayPeriod}`, string> = {
  'clear-day': '#38bdf8',
  'clear-night': '#0b1026',
  'cloudy-day': '#94a3b8',
  'cloudy-night': '#0f172a',
  'fog-day': '#cbd5e1',
  'fog-night': '#1f2937',
  'rain-day': '#64748b',
  'rain-night': '#020617',
  'storm-day': '#1e1b2e',
  'storm-night': '#110f1c',
  'snow-day': '#e2e8f0',
  'snow-night': '#1e293b',
}

export function getWeatherTheme(weatherCode: number, isDay: boolean): WeatherTheme {
  const scene = SCENE_BY_CONDITION[getWeatherCondition(weatherCode)]
  const period: DayPeriod = isDay ? 'day' : 'night'
  return {
    scene,
    period,
    tone: period === 'night' || scene === 'storm' ? 'dark' : 'light',
    themeColor: THEME_COLORS[`${scene}-${period}`],
  }
}

/** Writes the theme to `<html>` data attributes, which `theme.css` turns into design tokens. */
export function applyWeatherTheme(
  theme: WeatherTheme,
  root: HTMLElement = document.documentElement,
) {
  root.dataset.scene = theme.scene
  root.dataset.period = theme.period
  root.dataset.tone = theme.tone
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.themeColor)
}
