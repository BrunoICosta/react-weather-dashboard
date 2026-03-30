import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'
import { i18n } from '@/i18n/config'
import { server } from './mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// jsdom reports `en-US` as the browser language; tests run in the default pt-BR unless they switch.
beforeEach(async () => {
  await i18n.changeLanguage('pt-BR')
})

afterEach(() => {
  server.resetHandlers()
  server.events.removeAllListeners()
  cleanup()
  localStorage.clear()
  for (const key of ['scene', 'period', 'tone']) delete document.documentElement.dataset[key]
})

afterAll(() => server.close())
