import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { normalizeLanguage } from '@/i18n/config'
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
  const { i18n } = useTranslation()
  const locale = normalizeLanguage(i18n.resolvedLanguage)
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
      formatTemperature: (celsius) =>
        formatDegrees(convertTemperature(celsius, temperatureUnit), locale),
      formatWindSpeed: (kmh) =>
        `${formatInteger(convertWindSpeed(kmh, windSpeedUnit), locale)} ${WIND_SPEED_SYMBOL[windSpeedUnit]}`,
    }),
    [temperatureUnit, windSpeedUnit, setTemperatureUnit, setWindSpeedUnit, locale],
  )

  return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>
}
