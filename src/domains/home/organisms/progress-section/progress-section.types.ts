export type ProgressSectionLastExercise = {
  name: string
  rankLabel: string
  thumbnailUrl: string
}

export type ProgressSectionProps = {
  musclesOnTarget: number
  trackedMuscleCount: number
  lastExercise?: ProgressSectionLastExercise
  onVolumeClick: () => void
  onLastExerciseClick: () => void
}
