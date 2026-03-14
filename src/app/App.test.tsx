import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { App } from './App'

describe('App', () => {
  it('shows the current weather for the default city', async () => {
    renderWithProviders(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'Clima' })).toBeInTheDocument()
    const current = await screen.findByRole('region', { name: 'São Paulo' })
    expect(within(current).getByText('Parcialmente nublado')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Próximos 7 dias' })).toBeInTheDocument()
  })
})
