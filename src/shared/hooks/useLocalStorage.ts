import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react'

export const STORAGE_PREFIX = 'clima:'

function read<T>(key: string, fallback: T, isValid?: (value: unknown) => value is T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed: unknown = JSON.parse(raw)
    if (isValid && !isValid(parsed)) return fallback
    return parsed as T
  } catch {
    // Private mode, quota or corrupted JSON: fall back silently.
    return fallback
  }
}

/**
 * `useState` persisted in `localStorage` (JSON). Values that fail `isValid` are ignored, so a
 * stale or hand-edited entry never breaks the app. Changes made in other tabs are picked up too.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid?: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  const storageKey = STORAGE_PREFIX + key
  const [value, setValue] = useState<T>(() => read(storageKey, initialValue, isValid))

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value))
    } catch {
      // Ignore write failures (e.g. storage disabled); the in-memory state still works.
    }
  }, [storageKey, value])

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === storageKey) setValue(read(storageKey, initialValue, isValid))
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
    // `initialValue` and `isValid` are only fallbacks; re-subscribing when they change is not needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  const set = useCallback<Dispatch<SetStateAction<T>>>((next) => setValue(next), [])
  return [value, set]
}
