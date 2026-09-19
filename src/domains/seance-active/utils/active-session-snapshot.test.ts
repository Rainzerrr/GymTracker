import { describe, expect, it } from 'vitest'
import {
  SNAPSHOT_MAX_AGE_MS,
  createSnapshot,
  isSnapshotResumable,
  isStoredSnapshot,
} from './active-session-snapshot'

const NOW = 1_800_000_000_000
const fresh = createSnapshot('push', 3, NOW - 60_000, { weight: 60, reps: 6 })

describe('createSnapshot', () => {
  it('démarre à zéro avec les valeurs pré-remplies', () => {
    expect(fresh).toMatchObject({
      progress: [0, 0, 0],
      setLogsByExercise: [[], [], []],
      currentExerciseIndex: 0,
      weight: 60,
      reps: 6,
      selectedRir: null,
    })
  })
})

describe('isSnapshotResumable', () => {
  it('accepte une séance récente et cohérente', () => {
    expect(isSnapshotResumable(fresh, 'push', 3, NOW)).toBe(true)
  })

  it('refuse une autre séance', () => {
    expect(isSnapshotResumable(fresh, 'pull', 3, NOW)).toBe(false)
  })

  it('refuse une séance trop ancienne', () => {
    expect(isSnapshotResumable(fresh, 'push', 3, NOW + SNAPSHOT_MAX_AGE_MS)).toBe(false)
  })

  it('refuse une séance dont le nombre d’exercices a changé depuis', () => {
    expect(isSnapshotResumable(fresh, 'push', 4, NOW)).toBe(false)
  })

  it('refuse un exercice courant hors limites', () => {
    expect(isSnapshotResumable({ ...fresh, currentExerciseIndex: 3 }, 'push', 3, NOW)).toBe(false)
  })

  it('refuse l’absence de séance', () => {
    expect(isSnapshotResumable(null, 'push', 3, NOW)).toBe(false)
  })
})

describe('isStoredSnapshot', () => {
  it('accepte null et un snapshot valide', () => {
    expect(isStoredSnapshot(null)).toBe(true)
    expect(isStoredSnapshot(fresh)).toBe(true)
  })

  it('rejette un format inattendu', () => {
    expect(isStoredSnapshot({ sessionId: 'push' })).toBe(false)
    expect(isStoredSnapshot('oups')).toBe(false)
    expect(isStoredSnapshot([])).toBe(false)
  })
})
