export type BuilderExerciseRowProps = {
  name: string
  thumbnailUrl: string
  targetLabel: string
  restLabel: string
  onTargetChange: (value: string) => void
  onRemove: () => void
}
