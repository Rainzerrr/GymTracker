import type { MuscleGroup } from '@domains/seances/types/muscle-group'
import type { SetLogEntry } from './set-log-entry'

export type ExerciseLogEntry = {
  libraryExerciseId: string
  name: string
  thumbnailUrl: string
  muscleGroup: MuscleGroup
  sets: SetLogEntry[]
  // Remarque libre saisie pendant la séance (sensations, réglage de machine…)
  note?: string
}
