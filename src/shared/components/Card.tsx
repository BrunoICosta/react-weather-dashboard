import { useId, type ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  title?: string
  /** Id of a custom heading inside `children`, when `title` is not used. */
  labelledBy?: string
  /** Rendered next to the title (e.g. a small action or hint). */
  aside?: ReactNode
  className?: string
  children: ReactNode
}

export function Card({ title, labelledBy, aside, className, children }: CardProps) {
  const titleId = useId()
  return (
    <section
      className={[styles.card, className].filter(Boolean).join(' ')}
      aria-labelledby={title ? titleId : labelledBy}
    >
      {title && (
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {aside}
        </header>
      )}
      {children}
    </section>
  )
}
