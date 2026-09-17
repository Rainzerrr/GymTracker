export type ExerciseQueueItem = {
  id: string
  name: string
  thumbnailUrl: string
  targetLabel: string
  setCount: number
  completedSets: number
  isActive: boolean
}

export type ExerciseQueueProps = {
  exercises: ExerciseQueueItem[]
  onSelect: (index: number) => void
}
