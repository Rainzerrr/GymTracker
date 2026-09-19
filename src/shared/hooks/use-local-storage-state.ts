import { useEffect, useState, useSyncExternalStore } from 'react'
import {
  persistIfMissing,
  readStoredValue,
  subscribeToStorage,
  writeStoredValue,
} from '@shared/utils/storage/local-storage-store'
import type { StoredValueGuard } from '@shared/utils/storage/local-storage-store'

type Options<Value> = {
  // Rejette une valeur stockée au format inattendu : on repart alors de la valeur initiale.
  isValid?: StoredValueGuard<Value>
}

export const useLocalStorageState = <Value>(
  key: string,
  initialValue: Value,
  { isValid }: Options<Value> = {},
) => {
  // Référence figée : `initialValue` peut être un littéral recréé à chaque rendu.
  const [initial] = useState(initialValue)
  const value = useSyncExternalStore(subscribeToStorage, () =>
    readStoredValue(key, initial, isValid),
  )

  useEffect(() => {
    persistIfMissing(key, initial)
  }, [key, initial])

  const setValue = (next: Value | ((current: Value) => Value)) => {
    const resolved =
      typeof next === 'function'
        ? (next as (current: Value) => Value)(readStoredValue(key, initial, isValid))
        : next

    writeStoredValue(key, resolved)
  }

  return [value, setValue] as const
}
