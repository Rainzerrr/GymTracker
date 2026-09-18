import type { MuscleGroup } from './muscle-group'
import type { Movement } from './movement'

export type LibraryExercise = {
  id: string
  name: string
  muscleGroup: MuscleGroup
  movement: Movement
  equipment: string
  thumbnailUrl: string
}
