import type { ActiveSessionSnapshot, SessionStep } from '../types/active-session-snapshot'
import type { SetPrefill } from './set-prefill'

// Au-delà, on considère la séance abandonnée plutôt que d'afficher un chrono de plusieurs heures.
export const SNAPSHOT_MAX_AGE_MS = 12 * 60 * 60 * 1000

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'number')

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isStep = (value: unknown): value is SessionStep => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const candidate = value as Partial<SessionStep>

  return (
    typeof candidate.currentExerciseIndex === 'number' &&
    typeof candidate.reps === 'number' &&
    typeof candidate.weight === 'number' &&
    isNumberArray(candidate.progress) &&
    Array.isArray(candidate.setLogsByExercise) &&
    candidate.setLogsByExercise.every(Array.isArray)
  )
}

export const isStoredSnapshot = (value: unknown): value is ActiveSessionSnapshot | null => {
  if (value === null) {
    return true
  }

  if (!isStep(value)) {
    return false
  }

  const candidate = value as Partial<ActiveSessionSnapshot>

  return (
    typeof candidate.sessionId === 'string' &&
    typeof candidate.startedAt === 'number' &&
    isStringArray(candidate.notesByExercise) &&
    (candidate.previous === null || isStep(candidate.previous))
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
  snapshot.notesByExercise.length === exerciseCount &&
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
  notesByExercise: Array.from({ length: exerciseCount }, () => ''),
  currentExerciseIndex: 0,
  reps: prefill.reps,
  weight: prefill.weight,
  selectedRir: null,
  previous: null,
})

export const extractStep = (snapshot: ActiveSessionSnapshot): SessionStep => ({
  progress: snapshot.progress,
  setLogsByExercise: snapshot.setLogsByExercise,
  currentExerciseIndex: snapshot.currentExerciseIndex,
  reps: snapshot.reps,
  weight: snapshot.weight,
  selectedRir: snapshot.selectedRir,
})

// Revient à l'état d'avant la dernière série ; une seule annulation à la fois.
export const restorePreviousStep = (snapshot: ActiveSessionSnapshot): ActiveSessionSnapshot =>
  snapshot.previous ? { ...snapshot, ...snapshot.previous, previous: null } : snapshot
