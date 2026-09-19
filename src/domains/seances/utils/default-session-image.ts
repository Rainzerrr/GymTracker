import type { SessionFocus } from '../types/session-focus'
import { detectSessionFocus } from './detect-session-focus'

// Stored on sessions and log entries created before images depended on the focus.
const LEGACY_DEFAULT_SESSION_IMAGE_URL = '/images/workouts/upper-hypertrophy.jpg'

const FOCUS_IMAGE_URLS: Record<SessionFocus, string> = {
  push: '/images/workouts/push.jpg',
  pull: '/images/workouts/pull.jpg',
  upper: '/images/workouts/upper.jpg',
  lower: '/images/workouts/lower.jpg',
  'full-body': '/images/workouts/full-body.jpg',
}

export const DEFAULT_SESSION_IMAGE_URL = FOCUS_IMAGE_URLS['full-body']

export const resolveSessionImageUrl = (
  imageUrl: string,
  exercises: { libraryExerciseId: string }[],
): string => {
  if (imageUrl && imageUrl !== LEGACY_DEFAULT_SESSION_IMAGE_URL) {
    return imageUrl
  }

  // Only libraryExerciseId is read, so log entries can be resolved too.
  const focus = detectSessionFocus(exercises)

  return focus ? FOCUS_IMAGE_URLS[focus] : DEFAULT_SESSION_IMAGE_URL
}
