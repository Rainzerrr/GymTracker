import type { Tier, TierSubLevel } from './tier'

export type ExerciseProgressMilestone = {
  title: string
  subtitle: string
}

export type ExerciseProgressSeriesRecord = {
  exerciseId: string
  unit: string
  points: number[]
  milestone?: ExerciseProgressMilestone
}

export type ExerciseProgressSeries = {
  exerciseId: string
  exerciseName: string
  tier: Tier
  subLevel: TierSubLevel
  unit: string
  points: number[]
  milestone?: ExerciseProgressMilestone
}
