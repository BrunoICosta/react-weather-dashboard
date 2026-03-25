import { screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { FORECAST_URL } from '@/features/weather/api/forecastApi'
import { buildForecastResponse } from '@/test/fixtures/forecast'
import { server } from '@/test/mocks/server'
import { renderWithProviders } from '@/test/render'
import { App } from './App'

async function findCurrentCard(name = 'São Paulo') {
  return screen.findByRole('region', { name })
}

describe('App', () => {
  it('shows a skeleton and then the weather for the default city', async () => {
    renderWithProviders(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'Clima' })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Carregando previsão do tempo' })).toBeInTheDocument()

    const current = await findCurrentCard()
    expect(within(current).getByText('Parcialmente nublado')).toBeInTheDocument()
    expect(within(current).getByText('27°')).toBeInTheDocument()
    expect(within(current).getByText('Sensação térmica 29°')).toBeInTheDocument()
    expect(within(current).getByText(/13 km\/h/)).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Próximas 24 horas' })).toBeInTheDocument()
    expect(
      within(screen.getByRole('region', { name: 'Próximos 7 dias' })).getAllByRole('listitem'),
    ).toHaveLength(7)
  })

  it('converts values when the units change, without refetching', async () => {
    let requests = 0
    server.events.on('request:start', () => void requests++)
    const { user } = renderWithProviders(<App />)
    const current = await findCurrentCard()

    await user.click(screen.getByRole('radio', { name: '°F' }))
    await user.click(screen.getByRole('radio', { name: 'mph' }))

    expect(within(current).getByText('81°')).toBeInTheDocument()
    expect(within(current).getByText(/8 mph/)).toBeInTheDocument()
    expect(localStorage.getItem('clima:temperature-unit')).toBe('"fahrenheit"')
    expect(requests).toBe(1)
  })

  it('applies a theme matching the current weather', async () => {
    server.use(
      http.get(FORECAST_URL, () =>
        HttpResponse.json(buildForecastResponse({ weatherCode: 95, isDay: false })),
      ),
    )
    renderWithProviders(<App />)
    await findCurrentCard()

    await waitFor(() => expect(document.documentElement.dataset.scene).toBe('storm'))
    expect(document.documentElement.dataset.tone).toBe('dark')
  })

  it('saves the current city and switches between saved cities', async () => {
    const { user } = renderWithProviders(<App />)
    await findCurrentCard()

    expect(screen.getByText(/Nenhuma cidade salva ainda/)).toBeInTheDocument()
    const star = screen.getByRole('button', { name: 'Salvar São Paulo nos favoritos' })
    await user.click(star)
    expect(star).toHaveAttribute('aria-pressed', 'true')

    await user.type(screen.getByRole('combobox'), 'curiti')
    await user.click(await screen.findByRole('option', { name: /Curitiba/ }))
    await findCurrentCard('Curitiba')

    const saved = screen.getByRole('navigation', { name: 'Cidades salvas' })
    await user.click(within(saved).getByRole('button', { name: /^São Paulo/ }))

    expect(await findCurrentCard()).toBeInTheDocument()
    expect(within(saved).getByRole('button', { name: /^São Paulo/ })).toHaveAttribute(
      'aria-current',
      'true',
    )
  })

  it('shows an error with a working retry button', async () => {
    server.use(
      http.get(FORECAST_URL, () =>
        HttpResponse.json({ error: true, reason: 'Serviço indisponível' }, { status: 503 }),
      ),
    )
    const { user } = renderWithProviders(<App />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Não foi possível carregar a previsão')
    expect(alert).toHaveTextContent('Serviço indisponível')

    server.resetHandlers()
    await user.click(within(alert).getByRole('button', { name: 'Tentar novamente' }))

    expect(await findCurrentCard()).toBeInTheDocument()
  })
})
