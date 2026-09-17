export type ExerciseQueueRowProps = {
  name: string
  thumbnailUrl: string
  targetLabel: string
  setCount: number
  completedSets: number
  isActive: boolean
  onClick: () => void
}
