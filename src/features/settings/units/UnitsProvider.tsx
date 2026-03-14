import { useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { formatDegrees, formatInteger } from '@/shared/lib/format'
import {
  convertTemperature,
  convertWindSpeed,
  isTemperatureUnit,
  isWindSpeedUnit,
  WIND_SPEED_SYMBOL,
  type TemperatureUnit,
  type WindSpeedUnit,
} from '@/shared/lib/units'
import { UnitsContext, type UnitsContextValue } from './unitsContext'

export function UnitsProvider({ children }: { children: ReactNode }) {
  const [temperatureUnit, setTemperatureUnit] = useLocalStorage<TemperatureUnit>(
    'temperature-unit',
    'celsius',
    isTemperatureUnit,
  )
  const [windSpeedUnit, setWindSpeedUnit] = useLocalStorage<WindSpeedUnit>(
    'wind-speed-unit',
    'kmh',
    isWindSpeedUnit,
  )

  const value = useMemo<UnitsContextValue>(
    () => ({
      temperatureUnit,
      windSpeedUnit,
      setTemperatureUnit,
      setWindSpeedUnit,
      toTemperature: (celsius) => convertTemperature(celsius, temperatureUnit),
      formatTemperature: (celsius) => formatDegrees(convertTemperature(celsius, temperatureUnit)),
      formatWindSpeed: (kmh) =>
        `${formatInteger(convertWindSpeed(kmh, windSpeedUnit))} ${WIND_SPEED_SYMBOL[windSpeedUnit]}`,
    }),
    [temperatureUnit, windSpeedUnit, setTemperatureUnit, setWindSpeedUnit],
  )

  return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>
}
