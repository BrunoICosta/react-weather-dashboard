import { QueryClient } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { AppProviders } from '@/app/AppProviders'

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity, refetchOnWindowFocus: false },
    },
  })
}

/** Renders `ui` inside the app providers with an isolated, retry-free query client. */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  const queryClient = createTestQueryClient()
  const user = userEvent.setup()
  const result = render(ui, {
    wrapper: ({ children }) => <AppProviders queryClient={queryClient}>{children}</AppProviders>,
    ...options,
  })
  return { ...result, user, queryClient }
}
