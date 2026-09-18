import type { MuscleGroup } from './muscle-group'
import type { Movement } from './movement'
import type { Muscle } from './muscle'

export type LibraryExercise = {
  id: string
  name: string
  muscleGroup: MuscleGroup
  movement: Movement
  primaryMuscles: Muscle[]
  secondaryMuscles: Muscle[]
  equipment: string
  thumbnailUrl: string
}
