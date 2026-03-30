import type { ptBR } from './locales/pt-BR'

// Typed `t()`: keys, namespaces and interpolation are checked against the pt-BR resources.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: typeof ptBR
  }
}
