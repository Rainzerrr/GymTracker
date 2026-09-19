import type { MuscleGroup } from '@domains/seances/types/muscle-group'
import type { ExerciseLogEntry } from '../types/exercise-log-entry'
import type { SetLogEntry } from '../types/set-log-entry'

type ExerciseWithMeta = {
  libraryExerciseId: string
  name: string
  thumbnailUrl: string
  muscleGroup: MuscleGroup | undefined
  note?: string
}

export const buildLoggedExercises = (
  exercises: ExerciseWithMeta[],
  setLogsByExercise: SetLogEntry[][],
): ExerciseLogEntry[] =>
  exercises
    .map((exercise, index) => ({
      libraryExerciseId: exercise.libraryExerciseId,
      name: exercise.name,
      thumbnailUrl: exercise.thumbnailUrl,
      muscleGroup: exercise.muscleGroup,
      sets: setLogsByExercise[index] ?? [],
      ...(exercise.note?.trim() ? { note: exercise.note.trim() } : {}),
    }))
    .filter(
      (exercise): exercise is ExerciseLogEntry =>
        Boolean(exercise.muscleGroup) && exercise.sets.length > 0,
    )
