type CacheEntry = { raw: string; parsed: unknown }

export type StoredValueGuard<Value> = (value: unknown) => value is Value

const listeners = new Set<() => void>()
const parsedCache = new Map<string, CacheEntry>()
// Relais en mémoire quand le stockage est indisponible (navigation privée, quota atteint).
const memoryFallback = new Map<string, string>()

const notifyListeners = () => {
  listeners.forEach((listener) => listener())
}

const readRaw = (key: string): string | null => {
  try {
    const raw = globalThis.localStorage.getItem(key)

    if (raw !== null) {
      return raw
    }
  } catch {
    // Stockage indisponible : on retombe sur la mémoire.
  }

  return memoryFallback.get(key) ?? null
}

const writeRaw = (key: string, raw: string) => {
  try {
    globalThis.localStorage.setItem(key, raw)
    memoryFallback.delete(key)
  } catch {
    memoryFallback.set(key, raw)
  }
}

/**
 * Lit une valeur JSON. La référence renvoyée reste identique tant que le contenu stocké ne change
 * pas (indispensable pour `useSyncExternalStore`). Une valeur absente, illisible ou rejetée par
 * `isValid` (données périmées après une évolution du format) donne `initialValue`.
 */
export const readStoredValue = <Value>(
  key: string,
  initialValue: Value,
  isValid?: StoredValueGuard<Value>,
): Value => {
  const raw = readRaw(key)

  if (raw === null) {
    return initialValue
  }

  const cached = parsedCache.get(key)
  let parsed: unknown

  if (cached && cached.raw === raw) {
    parsed = cached.parsed
  } else {
    try {
      parsed = JSON.parse(raw)
    } catch {
      return initialValue
    }

    parsedCache.set(key, { raw, parsed })
  }

  return !isValid || isValid(parsed) ? (parsed as Value) : initialValue
}

export const writeStoredValue = (key: string, value: unknown) => {
  writeRaw(key, JSON.stringify(value))
  notifyListeners()
}

// Écrit la valeur par défaut au premier passage, sans écraser ce qui existe déjà.
export const persistIfMissing = (key: string, value: unknown) => {
  if (readRaw(key) === null) {
    writeStoredValue(key, value)
  }
}

export const subscribeToStorage = (listener: () => void) => {
  listeners.add(listener)

  const hasWindow = typeof window !== 'undefined'

  // L'événement `storage` signale les écritures venant d'un autre onglet.
  if (hasWindow) {
    window.addEventListener('storage', listener)
  }

  return () => {
    listeners.delete(listener)

    if (hasWindow) {
      window.removeEventListener('storage', listener)
    }
  }
}
