import type { ExerciseLogEntry } from './exercise-log-entry'

export type SessionLogEntry = {
  id: string
  sessionName: string
  imageUrl: string
  durationMinutes: number
  completedAt: string
  exercises: ExerciseLogEntry[]
}
