import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  server.resetHandlers()
  server.events.removeAllListeners()
  cleanup()
  localStorage.clear()
  for (const key of ['scene', 'period', 'tone']) delete document.documentElement.dataset[key]
})

afterAll(() => server.close())
