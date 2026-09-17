import { useEffect, useState } from 'react'

export const useLocalStorageState = <Value,>(key: string, initialValue: Value) => {
  const [value, setValue] = useState<Value>(() => {
    try {
      const stored = window.localStorage.getItem(key)

      return stored === null ? initialValue : (JSON.parse(stored) as Value)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Stockage indisponible (navigation privée, quota atteint) : on ignore.
    }
  }, [key, value])

  return [value, setValue] as const
}
