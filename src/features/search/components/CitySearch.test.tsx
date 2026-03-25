import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import { server } from '@/test/mocks/server'
import { renderWithProviders } from '@/test/render'
import { GEOCODING_URL } from '../api/geocodingApi'
import { CitySearch } from './CitySearch'

describe('CitySearch', () => {
  it('suggests cities after the user stops typing', async () => {
    const { user } = renderWithProviders(<CitySearch onSelect={vi.fn()} />)

    const input = screen.getByRole('combobox', { name: 'Buscar cidade' })
    await user.type(input, 'curi')

    const options = await screen.findAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual([
      'CuritibaParaná, Brasil',
      'CuricóRegião de Maule, Chile',
    ])
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('2 cidades encontradas.')
  })

  it('debounces requests while typing', async () => {
    const requests: string[] = []
    server.events.on('request:start', ({ request }) => {
      requests.push(new URL(request.url).searchParams.get('name') ?? '')
    })
    const { user } = renderWithProviders(<CitySearch onSelect={vi.fn()} />)

    await user.type(screen.getByRole('combobox'), 'curiti')
    await screen.findAllByRole('option')

    expect(requests).toEqual(['curiti'])
  })

  it('selects a city with the keyboard and clears the field', async () => {
    const onSelect = vi.fn()
    const { user } = renderWithProviders(<CitySearch onSelect={onSelect} />)
    const input = screen.getByRole('combobox')

    await user.type(input, 'curi')
    await screen.findAllByRole('option')
    await user.keyboard('{ArrowDown}{ArrowDown}')

    expect(screen.getByRole('option', { name: /Curicó/ })).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{Enter}')

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: '3885509', name: 'Curicó', countryCode: 'CL' }),
    )
    expect(input).toHaveValue('')
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('selects a city with the mouse', async () => {
    const onSelect = vi.fn()
    const { user } = renderWithProviders(<CitySearch onSelect={onSelect} />)

    await user.type(screen.getByRole('combobox'), 'curi')
    await user.click(await screen.findByRole('option', { name: /Curitiba/ }))

    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ name: 'Curitiba' }))
  })

  it('tells the user when nothing matches', async () => {
    const { user } = renderWithProviders(<CitySearch onSelect={vi.fn()} />)

    await user.type(screen.getByRole('combobox'), 'xyzzy')

    expect(await screen.findByText('Nenhuma cidade encontrada.')).toBeInTheDocument()
  })

  it('shows an error message when the geocoding API fails', async () => {
    server.use(http.get(GEOCODING_URL, () => HttpResponse.json({}, { status: 503 })))
    const { user } = renderWithProviders(<CitySearch onSelect={vi.fn()} />)

    await user.type(screen.getByRole('combobox'), 'curi')

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Erro ao buscar cidades.'),
    )
  })
})
