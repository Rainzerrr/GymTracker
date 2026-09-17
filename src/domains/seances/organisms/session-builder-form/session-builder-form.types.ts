import type { SessionDraft } from '../../types/workout-session'

export type SessionBuilderFormProps = {
  draft: SessionDraft
  onNameChange: (value: string) => void
  onExerciseTargetChange: (exerciseId: string, value: string) => void
  onExerciseRemove: (exerciseId: string) => void
  onToggleSuperset: (exerciseId: string) => void
  onAddExercise: () => void
  onSave: () => void
}
