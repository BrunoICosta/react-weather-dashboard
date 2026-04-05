import { useId } from 'react'

interface FlagProps {
  className?: string
}

/** Decorative flag of Brazil (28×20). */
export function BrazilFlag({ className }: FlagProps) {
  return (
    <svg
      viewBox="0 0 28 20"
      width={28}
      height={20}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="28" height="20" rx="2" fill="#009C3B" />
      <path d="M14 2.5 25.5 10 14 17.5 2.5 10Z" fill="#FFDF00" />
      <circle cx="14" cy="10" r="4.6" fill="#002776" />
      <path d="M9.6 8.9c3-.9 6.3-.6 8.9 1.1l-.3.9c-2.5-1.6-5.6-1.9-8.4-1.1Z" fill="#fff" />
    </svg>
  )
}

const STRIPES = Array.from({ length: 7 }, (_, i) => `M0 ${((i * 40) / 13).toFixed(2)}h28`).join('')
const STARS = [
  [2, 2],
  [5, 2],
  [8, 2],
  [11, 2],
  [3.5, 4],
  [6.5, 4],
  [9.5, 4],
  [2, 6],
  [5, 6],
  [8, 6],
  [11, 6],
  [3.5, 8],
  [6.5, 8],
  [9.5, 8],
] as const

/** Decorative flag of the United States (28×20). */
export function UsaFlag({ className }: FlagProps) {
  // The clip path id must be unique per instance, otherwise several flags on a page would clash.
  // React ids contain characters that are awkward inside `url(#…)`, so keep only safe ones.
  const clipId = `us-flag-${useId().replace(/[^\w-]/g, '')}`
  return (
    <svg
      viewBox="0 0 28 20"
      width={28}
      height={20}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <clipPath id={clipId}>
        <rect width="28" height="20" rx="2" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <rect width="28" height="20" fill="#fff" />
        <path d={STRIPES} stroke="#B22234" strokeWidth="1.54" transform="translate(0 .77)" />
        <rect width="12" height="10.77" fill="#3C3B6E" />
        <g fill="#fff">
          {STARS.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r=".6" />
          ))}
        </g>
      </g>
    </svg>
  )
}
