import type { CSSProperties } from 'react'
import styles from './Skeleton.module.css'

interface SkeletonProps {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  radius?: CSSProperties['borderRadius']
  className?: string
}

/** Decorative placeholder; the surrounding region announces the loading state. */
export function Skeleton({ width = '100%', height = '1rem', radius, className }: SkeletonProps) {
  return (
    <span
      className={[styles.skeleton, className].filter(Boolean).join(' ')}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  )
}
