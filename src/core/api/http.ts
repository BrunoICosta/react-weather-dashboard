export class ApiError extends Error {
  readonly status: number | undefined

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface OpenMeteoErrorBody {
  error?: boolean
  reason?: string
}

/**
 * Small `fetch` wrapper that throws an {@link ApiError} for network failures and non-2xx responses.
 * Open-Meteo answers invalid requests with `{ error: true, reason }`, which is surfaced as the message.
 */
export async function fetchJson<T>(url: URL | string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, init)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError('Não foi possível conectar ao servidor. Verifique sua conexão.')
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as OpenMeteoErrorBody | null
    throw new ApiError(body?.reason ?? `Erro ${response.status} ao buscar dados.`, response.status)
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
