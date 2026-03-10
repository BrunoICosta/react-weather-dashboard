export interface Coordinates {
  latitude: number
  longitude: number
}

/** A geographic location the dashboard can show the weather for. */
export interface Place extends Coordinates {
  /** Stable identifier: the geocoding id, or a coordinate-based id for the device location. */
  id: string
  name: string
  /** State / region (e.g. "São Paulo"). */
  region?: string
  country?: string
  countryCode?: string
  /** True when the place comes from the browser Geolocation API. */
  isCurrentLocation?: boolean
}
