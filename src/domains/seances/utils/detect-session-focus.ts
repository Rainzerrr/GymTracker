import { getLibraryExercise } from '../hooks/use-exercise-library'
import type { SessionExercise } from '../types/session-exercise'
import type { SessionFocus } from '../types/session-focus'

export const detectSessionFocus = (exercises: SessionExercise[]): SessionFocus | null => {
  let hasPush = false
  let hasPull = false
  let hasLegs = false
  let hasCore = false

  for (const exercise of exercises) {
    const movement = getLibraryExercise(exercise.libraryExerciseId)?.movement
    if (movement === 'push') hasPush = true
    else if (movement === 'pull') hasPull = true
    else if (movement === 'legs') hasLegs = true
    else if (movement === 'core') hasCore = true
  }

  const hasUpperBody = hasPush || hasPull || hasCore

  if (!hasUpperBody && !hasLegs) return null
  if (hasUpperBody && hasLegs) return 'full-body'
  if (hasLegs) return 'lower'
  if (hasPush && hasPull) return 'upper'
  if (hasPush) return 'push'
  if (hasPull) return 'pull'
  return 'upper'
}
