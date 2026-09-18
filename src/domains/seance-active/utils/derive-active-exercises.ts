import { getLibraryExercise } from '@domains/seances/hooks/use-exercise-library'
import { isBodyweightEquipment } from '@domains/seances/utils/is-bodyweight-equipment'
import { parseRestSeconds } from '@domains/seances/utils/parse-rest-seconds'
import { parseSetCount } from '@domains/seances/utils/parse-set-count'
import type { SessionExercise } from '@domains/seances/types/session-exercise'

export const deriveActiveExercises = (sessionExercises: SessionExercise[]) =>
  sessionExercises.map((exercise) => {
    const libraryExercise = getLibraryExercise(exercise.libraryExerciseId)

    return {
      ...exercise,
      setCount: parseSetCount(exercise.targetLabel),
      restSeconds: parseRestSeconds(exercise.restLabel),
      muscleGroup: libraryExercise?.muscleGroup,
      isBodyweight: libraryExercise ? isBodyweightEquipment(libraryExercise.equipment) : false,
    }
  })
