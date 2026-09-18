export type ExerciseSetConfigFormProps = {
  exerciseName: string
  exerciseMeta: string
  photoUrl: string
  sets: number
  onSetsChange: (value: number) => void
  allowMaxObjective: boolean
  isMaxObjective: boolean
  onMaxObjectiveChange: (value: boolean) => void
  repsMin: number
  onRepsMinChange: (value: number) => void
  repsMax: number
  onRepsMaxChange: (value: number) => void
  restLabel: string
  onRestLabelChange: (value: string) => void
  onSubmit: () => void
}
