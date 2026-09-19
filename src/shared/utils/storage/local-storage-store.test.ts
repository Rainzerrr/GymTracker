import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  persistIfMissing,
  readStoredValue,
  subscribeToStorage,
  writeStoredValue,
} from './local-storage-store'

const createFakeStorage = () => {
  const data = new Map<string, string>()

  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value)
    },
    data,
  }
}

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'number')

describe('local-storage-store', () => {
  let storage: ReturnType<typeof createFakeStorage>

  beforeEach(() => {
    storage = createFakeStorage()
    vi.stubGlobal('localStorage', storage)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renvoie la valeur initiale quand rien n’est stocké', () => {
    expect(readStoredValue('k-empty', 42)).toBe(42)
  })

  it('relit ce qui a été écrit', () => {
    writeStoredValue('k-roundtrip', { a: 1 })

    expect(readStoredValue('k-roundtrip', null)).toEqual({ a: 1 })
  })

  it('renvoie la même référence tant que le contenu ne change pas', () => {
    writeStoredValue('k-stable', [1, 2])

    expect(readStoredValue('k-stable', [])).toBe(readStoredValue('k-stable', []))
  })

  it('renvoie la valeur initiale si le JSON est corrompu', () => {
    storage.setItem('k-broken', '{oups')

    expect(readStoredValue('k-broken', 'défaut')).toBe('défaut')
  })

  it('renvoie la valeur initiale si le format ne passe pas la validation', () => {
    storage.setItem('k-invalid', JSON.stringify({ not: 'un tableau' }))

    expect(readStoredValue<number[]>('k-invalid', [], isNumberArray)).toEqual([])
  })

  it('prévient les abonnés à chaque écriture, ce qui synchronise les instances', () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToStorage(listener)

    writeStoredValue('k-notify', 1)
    unsubscribe()
    writeStoredValue('k-notify', 2)

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('n’écrase pas une valeur existante avec la valeur par défaut', () => {
    writeStoredValue('k-persist', 'existante')
    persistIfMissing('k-persist', 'défaut')
    persistIfMissing('k-persist-new', 'défaut')

    expect(readStoredValue('k-persist', '')).toBe('existante')
    expect(readStoredValue('k-persist-new', '')).toBe('défaut')
  })

  it('garde la valeur en mémoire quand le stockage refuse l’écriture', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
    })

    writeStoredValue('k-quota', 'en mémoire')

    expect(readStoredValue('k-quota', '')).toBe('en mémoire')
  })
})
