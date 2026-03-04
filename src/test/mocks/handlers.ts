import type { RequestHandler } from 'msw'

/** Default request handlers shared by every test. Individual tests can override them with `server.use`. */
export const handlers: RequestHandler[] = []
