import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiError } from '@/core/api/http'

/** Turns any thrown value into a message in the active language. */
export function useErrorMessage() {
  const { t } = useTranslation()
  return useCallback(
    (error: unknown) => {
      if (error instanceof ApiError) {
        if (error.kind === 'network') return t('errors.network')
        return error.reason ?? t('errors.http', { status: error.status ?? '' })
      }
      return t('errors.boundaryMessage')
    },
    [t],
  )
}
