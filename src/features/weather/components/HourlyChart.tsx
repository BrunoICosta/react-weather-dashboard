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
import { Card } from '@/shared/components/Card'
import { formatHour, formatPercent, formatTemperature } from '@/shared/lib/format'
import { getWeatherDescription } from '../lib/weatherCodes'
import type { HourlyPoint } from '../types'
import styles from './HourlyChart.module.css'

interface HourlyChartProps {
  points: HourlyPoint[]
}

interface ChartDatum {
  time: string
  hour: string
  temperature: number
  precipitation: number
  description: string
}

const SYNC_ID = 'hourly-forecast'
const AXIS_TICK = { fill: 'var(--text-muted)', fontSize: 12 }
const CHART_MARGIN = { top: 8, right: 8, bottom: 0, left: 0 }

function toChartData(points: HourlyPoint[]): ChartDatum[] {
  return points.map((point) => ({
    time: point.time,
    hour: formatHour(point.time),
    temperature: Math.round(point.temperature * 10) / 10,
    precipitation: point.precipitationProbability,
    description: getWeatherDescription(point.weatherCode),
  }))
}

function HourlyTooltip({ active, payload }: TooltipContentProps<number, string>) {
  const datum = payload?.[0]?.payload as ChartDatum | undefined
  if (!active || !datum) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipTitle}>{datum.hour}</p>
      <p>
        <span className={styles.keyTemperature} aria-hidden="true" />
        {formatTemperature(datum.temperature)} · {datum.description}
      </p>
      <p>
        <span className={styles.keyPrecipitation} aria-hidden="true" />
        {formatPercent(datum.precipitation)} de chance de chuva
      </p>
    </div>
  )
}

export function HourlyChart({ points }: HourlyChartProps) {
  const data = toChartData(points)

  if (data.length === 0) {
    return (
      <Card title="Próximas 24 horas">
        <p className={styles.empty}>Sem dados horários para este local.</p>
      </Card>
    )
  }

  const temperatures = data.map((d) => d.temperature)
  const min = Math.floor(Math.min(...temperatures)) - 1
  const max = Math.ceil(Math.max(...temperatures)) + 1

  return (
    <Card title="Próximas 24 horas">
      {/* Two stacked charts sharing the time axis instead of one dual-axis chart:
          °C and % have unrelated scales. `syncId` keeps their tooltips aligned. */}
      <div className={styles.charts} aria-hidden="true">
        <p className={styles.chartLabel}>Temperatura</p>
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
              tickFormatter={(value: number) => `${value}°`}
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
              name="Temperatura"
              stroke="var(--chart-temperature)"
              strokeWidth={2}
              fill="url(#temperature-fill)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--surface-solid)' }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        <p className={styles.chartLabel}>Chance de chuva</p>
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
              tickFormatter={(value: number) => `${value}%`}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={HourlyTooltip} cursor={{ fill: 'var(--chart-cursor)' }} />
            <Bar
              dataKey="precipitation"
              name="Chance de chuva"
              fill="var(--chart-precipitation)"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <details className={styles.tableToggle}>
        <summary>Ver dados em tabela</summary>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <caption className="sr-only">Previsão hora a hora para as próximas 24 horas</caption>
            <thead>
              <tr>
                <th scope="col">Hora</th>
                <th scope="col">Temperatura</th>
                <th scope="col">Chance de chuva</th>
                <th scope="col">Condição</th>
              </tr>
            </thead>
            <tbody>
              {data.map((datum) => (
                <tr key={datum.time}>
                  <th scope="row">{datum.hour}</th>
                  <td>{formatTemperature(datum.temperature)}</td>
                  <td>{formatPercent(datum.precipitation)}</td>
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
