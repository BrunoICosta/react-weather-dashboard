import type { ReactNode } from 'react'
import { getWeatherInfo, type WeatherCondition } from '../lib/weatherCodes'

interface WeatherIconProps {
  code: number
  isDay?: boolean
  size?: number
  /** When provided the icon is announced to assistive technology; otherwise it is decorative. */
  label?: string
  className?: string
}

const CLOUD_PATH = 'M46 48H20a10 10 0 0 1-1-19.95A14 14 0 0 1 46 26a11 11 0 0 1 0 22z'

function Sun({ cx = 32, cy = 32, r = 11 }: { cx?: number; cy?: number; r?: number }) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI) / 4
    const inner = r + 4
    const outer = r + 9
    return (
      <line
        key={i}
        x1={cx + Math.cos(angle) * inner}
        y1={cy + Math.sin(angle) * inner}
        x2={cx + Math.cos(angle) * outer}
        y2={cy + Math.sin(angle) * outer}
      />
    )
  })
  return (
    <g>
      <g stroke="#f59e0b" strokeWidth={3} strokeLinecap="round">
        {rays}
      </g>
      <circle cx={cx} cy={cy} r={r} fill="#fbbf24" />
    </g>
  )
}

function Moon({ transform }: { transform?: string }) {
  return (
    <path
      transform={transform}
      d="M38 10a22 22 0 1 0 16 34A18 18 0 0 1 38 10z"
      fill="#e2e8f0"
      stroke="#94a3b8"
      strokeWidth={1.5}
    />
  )
}

function Cloud({ transform, dark = false }: { transform?: string; dark?: boolean }) {
  return (
    <path
      transform={transform}
      d={CLOUD_PATH}
      fill={dark ? '#94a3b8' : '#f1f5f9'}
      stroke={dark ? '#475569' : '#94a3b8'}
      strokeWidth={2}
      strokeLinejoin="round"
    />
  )
}

function Drops({ color, count, short = false }: { color: string; count: number; short?: boolean }) {
  const xs = count === 2 ? [26, 38] : [22, 32, 42]
  return (
    <g stroke={color} strokeWidth={3} strokeLinecap="round">
      {xs.map((x) => (
        <line key={x} x1={x} y1={46} x2={x - 3} y2={short ? 51 : 56} />
      ))}
    </g>
  )
}

function Flakes() {
  return (
    <g fill="#93c5fd" stroke="#3b82f6" strokeWidth={1}>
      {[22, 32, 42].map((x, i) => (
        <circle key={x} cx={x} cy={i % 2 === 0 ? 50 : 56} r={3} />
      ))}
    </g>
  )
}

function renderIcon(condition: WeatherCondition, isDay: boolean): ReactNode {
  const up = 'translate(0 -8)'
  switch (condition) {
    case 'clear':
      return isDay ? <Sun /> : <Moon transform="translate(-6 -2)" />
    case 'partly-cloudy':
      return (
        <>
          {isDay ? (
            <Sun cx={24} cy={22} r={8} />
          ) : (
            <Moon transform="translate(-14 -6) scale(0.8)" />
          )}
          <Cloud transform="translate(4 6)" />
        </>
      )
    case 'cloudy':
      return (
        <>
          <Cloud transform="translate(-6 -6) scale(0.8)" dark />
          <Cloud transform="translate(4 4)" />
        </>
      )
    case 'fog':
      return (
        <>
          <Cloud transform={up} />
          <g stroke="#94a3b8" strokeWidth={3} strokeLinecap="round">
            <line x1={14} y1={48} x2={50} y2={48} />
            <line x1={20} y1={55} x2={56} y2={55} />
          </g>
        </>
      )
    case 'drizzle':
      return (
        <>
          <Cloud transform={up} />
          <Drops color="#60a5fa" count={3} short />
        </>
      )
    case 'rain':
      return (
        <>
          <Cloud transform={up} dark />
          <Drops color="#2563eb" count={3} />
        </>
      )
    case 'snow':
      return (
        <>
          <Cloud transform={up} />
          <Flakes />
        </>
      )
    case 'thunderstorm':
      return (
        <>
          <Cloud transform={up} dark />
          <path d="M34 40l-8 12h7l-3 10 10-14h-7l3-8z" fill="#facc15" stroke="#ca8a04" />
        </>
      )
  }
}

export function WeatherIcon({ code, isDay = true, size = 48, label, className }: WeatherIconProps) {
  const { condition } = getWeatherInfo(code)
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      focusable="false"
      data-condition={condition}
      {...a11y}
    >
      {renderIcon(condition, isDay)}
    </svg>
  )
}
