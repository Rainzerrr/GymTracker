import type { LibraryExercise } from '../../types/library-exercise'
import type { MuscleGroup } from '../../types/muscle-group'

export type ExercisePickerListProps = {
  results: LibraryExercise[]
  totalCount: number
  search: string
  onSearchChange: (value: string) => void
  muscleGroup: MuscleGroup | 'all'
  onMuscleGroupChange: (value: MuscleGroup | 'all') => void
  onSelect: (exercise: LibraryExercise) => void
}
