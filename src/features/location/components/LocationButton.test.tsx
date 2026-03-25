import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LocationButton } from './LocationButton'

type Geolocation = Pick<globalThis.Geolocation, 'getCurrentPosition'>

function mockGeolocation(getCurrentPosition: Geolocation['getCurrentPosition']) {
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: { getCurrentPosition } satisfies Geolocation,
  })
}

afterEach(() => {
  // jsdom has no Geolocation API; remove the mock so tests stay independent.
  Reflect.deleteProperty(navigator, 'geolocation')
})

describe('LocationButton', () => {
  it('turns the device position into a place', async () => {
    mockGeolocation((success) =>
      success({ coords: { latitude: -22.9068, longitude: -43.1729 } } as GeolocationPosition),
    )
    const onLocate = vi.fn()
    render(<LocationButton onLocate={onLocate} />)

    await userEvent.click(screen.getByRole('button', { name: 'Minha localização' }))

    expect(onLocate).toHaveBeenCalledWith({
      id: 'geo:-22.91,-43.17',
      name: 'Minha localização',
      latitude: -22.9068,
      longitude: -43.1729,
      isCurrentLocation: true,
    })
  })

  it('explains a denied permission and lets the user dismiss it', async () => {
    mockGeolocation((_success, error) =>
      error?.({ code: 1, message: 'User denied Geolocation' } as GeolocationPositionError),
    )
    const onLocate = vi.fn()
    render(<LocationButton onLocate={onLocate} />)

    await userEvent.click(screen.getByRole('button', { name: 'Minha localização' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Permissão de localização negada')
    expect(onLocate).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: 'Fechar aviso' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows a loading state while locating', async () => {
    mockGeolocation(() => {})
    render(<LocationButton onLocate={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'Minha localização' }))

    const button = screen.getByRole('button', { name: 'Localizando…' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('is disabled when the browser has no geolocation support', () => {
    render(<LocationButton onLocate={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Minha localização' })).toBeDisabled()
  })
})
