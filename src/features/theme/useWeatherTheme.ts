import { useEffect } from 'react'
import { applyWeatherTheme, getWeatherTheme } from './weatherTheme'

/** Adapts the page background and color tokens to the current weather and time of day. */
export function useWeatherTheme(weatherCode: number | undefined, isDay: boolean | undefined) {
  useEffect(() => {
    if (weatherCode === undefined || isDay === undefined) return
    applyWeatherTheme(getWeatherTheme(weatherCode, isDay))
  }, [weatherCode, isDay])
}
