import styles from './ErrorState.module.css'

interface ErrorStateProps {
  title: string
  message?: string
  onRetry?: () => void
  retrying?: boolean
}

export function ErrorState({ title, message, onRetry, retrying = false }: ErrorStateProps) {
  return (
    <div className={styles.state} role="alert">
      <svg viewBox="0 0 64 64" width={56} height={56} aria-hidden="true" focusable="false">
        <path
          d="M46 44H20a10 10 0 0 1-1-19.95A14 14 0 0 1 46 22a11 11 0 0 1 0 22z"
          fill="var(--surface-strong)"
          stroke="var(--text-muted)"
          strokeWidth={2}
        />
        <path d="M27 52l10-10m0 10L27 42" stroke="#ef4444" strokeWidth={3} strokeLinecap="round" />
      </svg>
      <h2 className={styles.title}>{title}</h2>
      {message && <p className={styles.message}>{message}</p>}
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry} disabled={retrying}>
          {retrying ? 'Tentando…' : 'Tentar novamente'}
        </button>
      )}
    </div>
  )
}
