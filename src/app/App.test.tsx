import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { AppProviders } from './AppProviders'

describe('App', () => {
  it('renders the main heading', () => {
    render(
      <AppProviders>
        <App />
      </AppProviders>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Clima' })).toBeInTheDocument()
  })
})
