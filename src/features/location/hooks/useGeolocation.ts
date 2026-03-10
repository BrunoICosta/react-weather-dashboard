import { useCallback, useEffect, useRef, useState } from 'react'
import type { Coordinates } from '@/core/types/place'

export type GeolocationStatus = 'idle' | 'locating' | 'error'

/** `unknown` when the Permissions API is unavailable (e.g. older Safari). */
export type GeolocationPermission = PermissionState | 'unknown' | 'unsupported'

const ERROR_MESSAGES: Record<number, string> = {
  1: 'Permissão de localização negada. Libere o acesso nas configurações do navegador.',
  2: 'Não foi possível determinar sua localização agora.',
  3: 'A localização demorou demais para responder. Tente novamente.',
}

export function getGeolocationErrorMessage(code: number): string {
  return ERROR_MESSAGES[code] ?? 'Erro desconhecido ao obter a localização.'
}

const POSITION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10_000,
  // A position from the last 5 minutes is accurate enough for a forecast.
  maximumAge: 5 * 60_000,
}

function isSupported(): boolean {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator
}

export function useGeolocation() {
  const [status, setStatus] = useState<GeolocationStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [permission, setPermission] = useState<GeolocationPermission>(() =>
    isSupported() ? 'unknown' : 'unsupported',
  )
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  // Track the permission so the UI can explain a previously denied request up front.
  useEffect(() => {
    if (!isSupported() || !navigator.permissions?.query) return
    let status: PermissionStatus | undefined
    const update = () => status && setPermission(status.state)

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((result) => {
        status = result
        update()
        result.addEventListener('change', update)
      })
      .catch(() => setPermission('unknown'))

    return () => status?.removeEventListener('change', update)
  }, [])

  const locate = useCallback((onSuccess: (coordinates: Coordinates) => void) => {
    if (!isSupported()) {
      setStatus('error')
      setError('Seu navegador não oferece suporte à geolocalização.')
      return
    }

    setStatus('locating')
    setError(null)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!mounted.current) return
        setStatus('idle')
        onSuccess({ latitude: coords.latitude, longitude: coords.longitude })
      },
      (positionError) => {
        if (!mounted.current) return
        setStatus('error')
        setError(getGeolocationErrorMessage(positionError.code))
      },
      POSITION_OPTIONS,
    )
  }, [])

  const dismissError = useCallback(() => {
    setStatus('idle')
    setError(null)
  }, [])

  return { status, error, permission, locate, dismissError }
}
