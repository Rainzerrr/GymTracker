import type { SessionExercise } from '../types/session-exercise'
import { SESSION_FOCUS_LABELS } from '../types/session-focus'
import type { WorkoutSession } from '../types/workout-session'
import { detectSessionFocus } from './detect-session-focus'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const generateSessionName = (
  exercises: SessionExercise[],
  otherSessions: WorkoutSession[],
): { name: string; focusLabel: string } | null => {
  const focus = detectSessionFocus(exercises)
  if (!focus) return null

  const focusLabel = SESSION_FOCUS_LABELS[focus]
  const sameFocusCount = otherSessions.filter(
    (session) => detectSessionFocus(session.exercises) === focus,
  ).length
  const letter = LETTERS[Math.min(sameFocusCount, LETTERS.length - 1)]

  return { name: `${focusLabel} ${letter}`, focusLabel }
}
