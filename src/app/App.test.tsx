import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { App } from './App'

describe('App', () => {
  it('shows the current weather for the default city', async () => {
    renderWithProviders(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'Clima' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'São Paulo' })).toBeInTheDocument()
    expect(screen.getByText('Parcialmente nublado')).toBeInTheDocument()
  })
})
