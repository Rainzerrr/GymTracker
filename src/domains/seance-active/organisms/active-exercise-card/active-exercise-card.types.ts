import type { RirValue } from '../../types/rir-value'

export type ActiveExerciseCardProps = {
  name: string
  photoUrl: string
  currentSetNumber: number
  totalSets: number
  targetLabel: string
  reps: number
  onRepsChange: (value: number) => void
  weight: number
  onWeightChange: (value: number) => void
  isBodyweight: boolean
  selectedRir: RirValue | null
  onSelectRir: (value: RirValue) => void
  isResting: boolean
  restRemainingSeconds: number
  restTotalSeconds: number
  onValidate: () => void
}
