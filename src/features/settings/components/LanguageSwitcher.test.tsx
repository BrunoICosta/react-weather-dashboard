import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from '@/app/App'
import { LANGUAGE_STORAGE_KEY } from '@/i18n/config'
import { server } from '@/test/mocks/server'
import { renderWithProviders } from '@/test/render'

describe('LanguageSwitcher', () => {
  it('renders one flag radio per language, named in its own language', async () => {
    renderWithProviders(<App />)
    await screen.findByRole('region', { name: 'São Paulo' })

    const group = screen.getByRole('radiogroup', { name: 'Idioma' })
    const portuguese = within(group).getByRole('radio', { name: 'Português (Brasil)' })
    const english = within(group).getByRole('radio', { name: 'English' })

    expect(portuguese).toHaveAttribute('lang', 'pt-BR')
    expect(english).toHaveAttribute('lang', 'en')
    expect(within(group).getByTitle('English')).toContainElement(english)
    // Flags are decorative: the accessible name comes from the radio label.
    expect(group.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(2)
    expect(within(group).queryByText(/^(PT|EN)$/)).not.toBeInTheDocument()
  })

  it('switches language with the arrow keys and persists the choice', async () => {
    const { user } = renderWithProviders(<App />)
    await screen.findByRole('region', { name: 'São Paulo' })

    screen.getByRole('radio', { name: 'Português (Brasil)' }).focus()
    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('radio', { name: 'English' })).toBeChecked()
    expect(screen.getByRole('heading', { level: 1, name: 'Weather' })).toBeInTheDocument()
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en')
  })

  it('shows the current language and switches the whole UI to English', async () => {
    const { user } = renderWithProviders(<App />)
    await screen.findByRole('region', { name: 'São Paulo' })

    const group = screen.getByRole('radiogroup', { name: 'Idioma' })
    expect(within(group).getByRole('radio', { name: 'Português (Brasil)' })).toBeChecked()

    await user.click(within(group).getByRole('radio', { name: 'English' }))

    expect(screen.getByRole('radiogroup', { name: 'Language' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'English' })).toBeChecked()
    expect(screen.getByRole('heading', { level: 1, name: 'Weather' })).toBeInTheDocument()
    const current = screen.getByRole('region', { name: 'São Paulo' })
    expect(within(current).getByText('Partly cloudy')).toBeInTheDocument()
    expect(within(current).getByText('Feels like 29°')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Next 7 days' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Search city' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en')
  })

  it('asks the geocoding API for names in the active language', async () => {
    const languages: string[] = []
    server.events.on('request:start', ({ request }) => {
      const url = new URL(request.url)
      if (url.hostname.startsWith('geocoding'))
        languages.push(url.searchParams.get('language') ?? '')
    })
    const { user } = renderWithProviders(<App />)
    await screen.findByRole('region', { name: 'São Paulo' })

    await user.type(screen.getByRole('combobox'), 'curi')
    await screen.findAllByRole('option')
    await user.click(screen.getByRole('radio', { name: 'English' }))
    await user.clear(screen.getByRole('combobox'))
    await user.type(screen.getByRole('combobox'), 'curi')
    await screen.findAllByRole('option')

    expect(languages).toEqual(['pt', 'en'])
  })
})
