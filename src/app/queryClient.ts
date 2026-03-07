import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/core/api/http'

const MINUTE = 60_000

/** Client errors (4xx) will not fix themselves, so only network/5xx failures are retried. */
function shouldRetry(failureCount: number, error: Error): boolean {
  if (error instanceof ApiError && error.status !== undefined && error.status < 500) return false
  return failureCount < 2
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * MINUTE,
        gcTime: 30 * MINUTE,
        retry: shouldRetry,
        refetchOnWindowFocus: true,
      },
    },
  })
}
