import { getLibraryExercise } from '@domains/seances/hooks/use-exercise-library'
import { getWeightIncrement } from '@domains/seances/utils/get-weight-increment'
import { isBodyweightEquipment } from '@domains/seances/utils/is-bodyweight-equipment'
import { parseRepRange } from '@domains/seances/utils/parse-rep-range'
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
      repRange: parseRepRange(exercise.targetLabel),
      muscleGroup: libraryExercise?.muscleGroup,
      isBodyweight: libraryExercise ? isBodyweightEquipment(libraryExercise.equipment) : false,
      weightIncrement: getWeightIncrement(
        libraryExercise?.equipment ?? '',
        libraryExercise?.muscleGroup,
      ),
    }
  })
