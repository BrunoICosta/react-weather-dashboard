import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { useUnits } from '@/features/settings/units/unitsContext'
import { useFormatters } from '@/i18n/useFormatters'
import { Card } from '@/shared/components/Card'
import { useWeatherDescription } from '../lib/weatherCodes'
import type { HourlyPoint } from '../types'
import styles from './HourlyChart.module.css'

interface HourlyChartProps {
  points: HourlyPoint[]
}

interface ChartDatum {
  time: string
  hour: string
  /** Already converted to the selected unit. */
  temperature: number
  precipitation: number
  description: string
  /** Pre-formatted labels in the active language (used by the tooltip and the table). */
  temperatureLabel: string
  precipitationLabel: string
  precipitationSentence: string
}

const SYNC_ID = 'hourly-forecast'
const AXIS_TICK = { fill: 'var(--text-muted)', fontSize: 12 }
const CHART_MARGIN = { top: 8, right: 8, bottom: 0, left: 0 }

function HourlyTooltip({ active, payload }: TooltipContentProps<number, string>) {
  const datum = payload?.[0]?.payload as ChartDatum | undefined
  if (!active || !datum) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipTitle}>{datum.hour}</p>
      <p>
        <span className={styles.keyTemperature} aria-hidden="true" />
        {datum.temperatureLabel} · {datum.description}
      </p>
      <p>
        <span className={styles.keyPrecipitation} aria-hidden="true" />
        {datum.precipitationSentence}
      </p>
    </div>
  )
}

export function HourlyChart({ points }: HourlyChartProps) {
  const { t } = useTranslation('weather', { keyPrefix: 'hourly' })
  const { toTemperature } = useUnits()
  const format = useFormatters()
  const describe = useWeatherDescription()

  const data: ChartDatum[] = points.map((point) => {
    const temperature = Math.round(toTemperature(point.temperature) * 10) / 10
    const precipitationLabel = format.percent(point.precipitationProbability)
    return {
      time: point.time,
      hour: format.hour(point.time),
      temperature,
      precipitation: point.precipitationProbability,
      description: describe(point.weatherCode),
      temperatureLabel: format.degrees(temperature),
      precipitationLabel,
      precipitationSentence: t('precipitationValue', { value: precipitationLabel }),
    }
  })

  if (data.length === 0) {
    return (
      <Card title={t('title')}>
        <p className={styles.empty}>{t('empty')}</p>
      </Card>
    )
  }

  const temperatures = data.map((d) => d.temperature)
  const min = Math.floor(Math.min(...temperatures)) - 1
  const max = Math.ceil(Math.max(...temperatures)) + 1

  return (
    <Card title={t('title')}>
      {/* Two stacked charts sharing the time axis instead of one dual-axis chart:
          °C and % have unrelated scales. `syncId` keeps their tooltips aligned. */}
      <div className={styles.charts} aria-hidden="true">
        <p className={styles.chartLabel}>{t('temperature')}</p>
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={data} syncId={SYNC_ID} margin={CHART_MARGIN}>
            <defs>
              <linearGradient id="temperature-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-temperature)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--chart-temperature)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
            <XAxis dataKey="hour" hide />
            <YAxis
              domain={[min, max]}
              tickFormatter={(value: number) => format.degrees(value)}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              width={40}
              allowDecimals={false}
            />
            <Tooltip
              content={HourlyTooltip}
              cursor={{ stroke: 'var(--text-muted)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="temperature"
              name={t('temperature')}
              stroke="var(--chart-temperature)"
              strokeWidth={2}
              fill="url(#temperature-fill)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--surface-solid)' }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        <p className={styles.chartLabel}>{t('precipitation')}</p>
        <ResponsiveContainer width="100%" height={110}>
          <BarChart data={data} syncId={SYNC_ID} margin={CHART_MARGIN} barCategoryGap={2}>
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
            <XAxis
              dataKey="hour"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: 'var(--chart-grid)' }}
              interval={2}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tickFormatter={(value: number) => format.percent(value)}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={HourlyTooltip} cursor={{ fill: 'var(--chart-cursor)' }} />
            <Bar
              dataKey="precipitation"
              name={t('precipitation')}
              fill="var(--chart-precipitation)"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <details className={styles.tableToggle}>
        <summary>{t('showTable')}</summary>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <caption className="sr-only">{t('tableCaption')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('hour')}</th>
                <th scope="col">{t('temperature')}</th>
                <th scope="col">{t('precipitation')}</th>
                <th scope="col">{t('condition')}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((datum) => (
                <tr key={datum.time}>
                  <th scope="row">{datum.hour}</th>
                  <td>{datum.temperatureLabel}</td>
                  <td>{datum.precipitationLabel}</td>
                  <td>{datum.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </Card>
  )
}
