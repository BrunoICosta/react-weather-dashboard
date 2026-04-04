import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { i18n } from '@/i18n/config'
import { buildForecastResponse } from '@/test/fixtures/forecast'
import { renderWithProviders } from '@/test/render'
import { mapForecast } from '../api/mapForecast'
import { DailyForecast } from './DailyForecast'

const { daily } = mapForecast(buildForecastResponse())

describe('DailyForecast', () => {
  it('renders in Portuguese', () => {
    renderWithProviders(<DailyForecast days={daily} />)

    const list = screen.getByRole('region', { name: 'Próximos 7 dias' })
    const [today, tomorrow] = within(list).getAllByRole('listitem')
    expect(today).toHaveTextContent('Hoje')
    expect(today).toHaveTextContent('Hoje, terça-feira, 10 de março')
    expect(today).toHaveTextContent('Parcialmente nublado')
    expect(today).toHaveTextContent('Mínima 19°')
    expect(tomorrow).toHaveTextContent('Qua')
    expect(tomorrow).toHaveTextContent('Chuva fraca')
  })

  it('renders in English', async () => {
    await i18n.changeLanguage('en')
    renderWithProviders(<DailyForecast days={daily} />)

    const list = screen.getByRole('region', { name: 'Next 7 days' })
    const [today, tomorrow] = within(list).getAllByRole('listitem')
    expect(today).toHaveTextContent('Today, Tuesday, March 10')
    expect(today).toHaveTextContent('Partly cloudy')
    expect(today).toHaveTextContent('Low 19°')
    expect(tomorrow).toHaveTextContent('Wed')
    expect(tomorrow).toHaveTextContent('Slight rain')
  })

  it('shows an empty state', () => {
    renderWithProviders(<DailyForecast days={[]} />)
    expect(screen.getByText('Sem previsão diária para este local.')).toBeInTheDocument()
  })
})
