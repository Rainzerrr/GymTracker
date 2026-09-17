import type { MuscleGroup } from './muscle-group'

export type LibraryExercise = {
  id: string
  name: string
  muscleGroup: MuscleGroup
  equipment: string
  thumbnailUrl: string
}
