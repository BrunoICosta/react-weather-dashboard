import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import type { i18n as I18n } from 'i18next'
import { useState, type ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { UnitsProvider } from '@/features/settings/units/UnitsProvider'
import { i18n as defaultI18n } from '@/i18n/config'
import { createQueryClient } from './queryClient'

interface AppProvidersProps {
  children: ReactNode
  /** Lets tests inject a client with retries disabled. */
  queryClient?: QueryClient
  i18n?: I18n
}

export function AppProviders({ children, queryClient, i18n = defaultI18n }: AppProvidersProps) {
  const [client] = useState(() => queryClient ?? createQueryClient())
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={client}>
        <UnitsProvider>{children}</UnitsProvider>
      </QueryClientProvider>
    </I18nextProvider>
  )
}
