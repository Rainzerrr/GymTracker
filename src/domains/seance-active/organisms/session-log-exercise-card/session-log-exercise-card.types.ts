export type SessionLogSet = {
  weight: number
  reps: number
}

export type SessionLogExerciseCardProps = {
  name: string
  thumbnailUrl: string
  isBodyweight: boolean
  sets: SessionLogSet[]
  onWeightChange: (setIndex: number, value: number) => void
  onRepsChange: (setIndex: number, value: number) => void
}
