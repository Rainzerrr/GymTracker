import { buildExercisePerformanceIndex } from '@domains/progression/utils/build-exercise-performance-index'
import { useSessionLog } from './use-session-log'
import {
  DEFAULT_REPS,
  DEFAULT_WEIGHT,
  findLastPerformance,
  resolveSetPrefill,
} from '../utils/set-prefill'

type ExerciseRef = { libraryExerciseId: string }

// Ce que l'utilisateur a fait la dernière fois sur chaque exercice de la séance en cours.
export const useExerciseHistory = (exercises: ExerciseRef[]) => {
  const { sessionLog } = useSessionLog()
  const performanceIndex = buildExercisePerformanceIndex(sessionLog)

  const prefillFor = (exerciseIndex: number) => {
    const exercise = exercises[exerciseIndex]

    return exercise
      ? resolveSetPrefill(performanceIndex, exercise.libraryExerciseId)
      : { weight: DEFAULT_WEIGHT, reps: DEFAULT_REPS }
  }

  const lastPerformanceFor = (exerciseIndex: number) => {
    const exercise = exercises[exerciseIndex]

    return exercise ? findLastPerformance(performanceIndex, exercise.libraryExerciseId) : null
  }

  return { prefillFor, lastPerformanceFor }
}
