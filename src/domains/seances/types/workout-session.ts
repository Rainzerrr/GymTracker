import type { SessionExercise } from './session-exercise'

export type SessionDraft = {
  name: string
  focusLabel: string
  imageUrl: string
  exercises: SessionExercise[]
}

export type WorkoutSession = SessionDraft & {
  id: string
}
