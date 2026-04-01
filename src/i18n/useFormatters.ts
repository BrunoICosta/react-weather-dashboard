import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  formatCoordinates,
  formatDecimal,
  formatDegrees,
  formatHour,
  formatInteger,
  formatLocalTime,
  formatLongDate,
  formatPercent,
  formatPrecipitation,
  formatWeekday,
  getUvLevel,
  toCompassPoint,
} from '@/shared/lib/format'
import { normalizeLanguage } from './config'

/** The formatting helpers bound to the active language. */
export function useFormatters() {
  const { t, i18n } = useTranslation('weather')
  const locale = normalizeLanguage(i18n.resolvedLanguage)

  return useMemo(
    () => ({
      locale,
      integer: (value: number) => formatInteger(value, locale),
      decimal: (value: number) => formatDecimal(value, locale),
      percent: (value: number) => formatPercent(value, locale),
      degrees: (value: number) => formatDegrees(value, locale),
      precipitation: (mm: number) => formatPrecipitation(mm, locale),
      weekday: (isoDate: string) => formatWeekday(isoDate, locale),
      longDate: (isoDate: string) => formatLongDate(isoDate, locale),
      hour: (isoDateTime: string) => formatHour(isoDateTime, locale),
      localTime: (isoDateTime: string) => formatLocalTime(isoDateTime, locale),
      compass: (degrees: number) => t(`compass.${toCompassPoint(degrees)}`),
      uvLabel: (index: number) => t(`uv.${getUvLevel(index)}`),
      coordinates: (latitude: number, longitude: number) =>
        formatCoordinates(latitude, longitude, locale, (point) => t(`compass.${point}`)),
    }),
    [locale, t],
  )
}
