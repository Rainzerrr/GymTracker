import type { ActiveSessionSnapshot } from '../types/active-session-snapshot'
import type { SetPrefill } from './set-prefill'

// Au-delà, on considère la séance abandonnée plutôt que d'afficher un chrono de plusieurs heures.
export const SNAPSHOT_MAX_AGE_MS = 12 * 60 * 60 * 1000

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'number')

export const isStoredSnapshot = (value: unknown): value is ActiveSessionSnapshot | null => {
  if (value === null) {
    return true
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const candidate = value as Partial<ActiveSessionSnapshot>

  return (
    typeof candidate.sessionId === 'string' &&
    typeof candidate.startedAt === 'number' &&
    typeof candidate.currentExerciseIndex === 'number' &&
    typeof candidate.reps === 'number' &&
    typeof candidate.weight === 'number' &&
    isNumberArray(candidate.progress) &&
    Array.isArray(candidate.setLogsByExercise) &&
    candidate.setLogsByExercise.every(Array.isArray)
  )
}

// Reprise possible : même séance, récente, et toujours cohérente avec ses exercices actuels.
export const isSnapshotResumable = (
  snapshot: ActiveSessionSnapshot | null,
  sessionId: string | undefined,
  exerciseCount: number,
  now: number,
): snapshot is ActiveSessionSnapshot =>
  snapshot !== null &&
  snapshot.sessionId === sessionId &&
  now - snapshot.startedAt < SNAPSHOT_MAX_AGE_MS &&
  snapshot.progress.length === exerciseCount &&
  snapshot.setLogsByExercise.length === exerciseCount &&
  snapshot.currentExerciseIndex >= 0 &&
  snapshot.currentExerciseIndex < exerciseCount

export const createSnapshot = (
  sessionId: string,
  exerciseCount: number,
  startedAt: number,
  prefill: SetPrefill,
): ActiveSessionSnapshot => ({
  sessionId,
  startedAt,
  progress: Array.from({ length: exerciseCount }, () => 0),
  setLogsByExercise: Array.from({ length: exerciseCount }, () => []),
  currentExerciseIndex: 0,
  reps: prefill.reps,
  weight: prefill.weight,
  selectedRir: null,
})
