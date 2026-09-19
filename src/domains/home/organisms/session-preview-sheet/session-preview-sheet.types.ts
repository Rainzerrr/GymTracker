import type { TargetSet, NextTarget } from '@domains/progression/utils/suggest-next-target'
import type { MuscleGroup } from '@domains/seances/types/muscle-group'

export type SessionPreviewExercise = {
  id: string
  name: string
  thumbnailUrl: string
  targetLabel: string
  restLabel: string
  isBodyweight: boolean
  lastSets: TargetSet[] | null
  nextTarget: NextTarget | null
}

export type SessionPreviewSheetProps = {
  title: string
  exercises: SessionPreviewExercise[]
  muscleGroups: MuscleGroup[]
  durationMinutes: number
  lastDoneAt?: string
  // Absent quand la séance ne peut pas être lancée depuis ce jour.
  startLabel?: string
  onStart?: () => void
  onClose: () => void
}
