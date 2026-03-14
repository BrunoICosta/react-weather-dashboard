import { createContext, useContext } from 'react'
import type { TemperatureUnit, WindSpeedUnit } from '@/shared/lib/units'

export interface UnitsContextValue {
  temperatureUnit: TemperatureUnit
  windSpeedUnit: WindSpeedUnit
  setTemperatureUnit: (unit: TemperatureUnit) => void
  setWindSpeedUnit: (unit: WindSpeedUnit) => void
  /** °C → selected unit, unrounded (used by the chart). */
  toTemperature: (celsius: number) => number
  /** °C → e.g. `27°` */
  formatTemperature: (celsius: number) => string
  /** km/h → e.g. `8 mph` */
  formatWindSpeed: (kmh: number) => string
}

export const UnitsContext = createContext<UnitsContextValue | null>(null)

export function useUnits(): UnitsContextValue {
  const context = useContext(UnitsContext)
  if (!context) throw new Error('useUnits must be used inside <UnitsProvider>')
  return context
}
