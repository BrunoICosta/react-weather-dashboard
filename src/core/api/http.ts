export type ApiErrorKind = 'network' | 'http'

/**
 * Errors carry a kind and status instead of a ready-made message, so the UI can describe them in
 * the active language. `reason` is the explanation sent by Open-Meteo (third-party text, shown as is).
 */
export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status: number | undefined
  readonly reason: string | undefined

  constructor(kind: ApiErrorKind, options: { status?: number; reason?: string } = {}) {
    super(options.reason ?? (kind === 'network' ? 'Network error' : `HTTP ${options.status}`))
    this.name = 'ApiError'
    this.kind = kind
    this.status = options.status
    this.reason = options.reason
  }
}

interface OpenMeteoErrorBody {
  error?: boolean
  reason?: string
}

/**
 * Small `fetch` wrapper that throws an {@link ApiError} for network failures and non-2xx responses.
 * Open-Meteo answers invalid requests with `{ error: true, reason }`.
 */
export async function fetchJson<T>(url: URL | string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, init)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError('network')
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as OpenMeteoErrorBody | null
    throw new ApiError('http', { status: response.status, reason: body?.reason })
  }

  return (await response.json()) as T
}

/** Builds a URL with the given query parameters, skipping `undefined` values. */
export function buildUrl(
  base: string,
  params: Record<string, string | number | boolean | undefined>,
): URL {
  const url = new URL(base)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }
  return url
}
