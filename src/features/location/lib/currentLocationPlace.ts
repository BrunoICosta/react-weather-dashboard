import type { Coordinates, Place } from '@/core/types/place'

/**
 * Open-Meteo has no reverse geocoding, so the device location is shown with a generic name
 * and its coordinates.
 */
export function createCurrentLocationPlace({ latitude, longitude }: Coordinates): Place {
  return {
    id: `geo:${latitude.toFixed(2)},${longitude.toFixed(2)}`,
    name: 'Minha localização',
    latitude,
    longitude,
    isCurrentLocation: true,
  }
}
