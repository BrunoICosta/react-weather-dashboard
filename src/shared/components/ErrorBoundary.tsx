import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: (props: { error: Error; reset: () => void }) => ReactNode
  /** Called when the boundary resets (e.g. to reset TanStack Query errors as well). */
  onReset?: () => void
  /** The boundary resets automatically when any of these values change. */
  resetKeys?: readonly unknown[]
}

interface ErrorBoundaryState {
  error: Error | null
}

function changed(a: readonly unknown[] = [], b: readonly unknown[] = []) {
  return a.length !== b.length || a.some((value, index) => !Object.is(value, b[index]))
}

/**
 * Catches render errors so one broken widget does not blank the whole page.
 * Error boundaries still require a class component in React 19.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // A real app would report this to an error tracker (Sentry, etc.).
    console.error('Unexpected render error', error, info.componentStack)
  }

  componentDidUpdate(previous: ErrorBoundaryProps) {
    if (this.state.error && changed(previous.resetKeys, this.props.resetKeys)) this.reset()
  }

  reset = () => {
    this.props.onReset?.()
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (error) return this.props.fallback({ error, reset: this.reset })
    return this.props.children
  }
}
