import { buildExercisePerformanceIndex } from '@domains/progression/utils/build-exercise-performance-index'
import { useSessionLog } from './use-session-log'
import {
  DEFAULT_REPS,
  DEFAULT_WEIGHT,
  findLastSets,
  resolveNextTarget,
  resolveSetPrefill,
} from '../utils/set-prefill'
import type { PrefillExercise } from '../utils/set-prefill'

// Ce que l'utilisateur a fait la dernière fois sur chaque exercice de la séance en cours, et ce
// qu'on lui propose cette fois.
export const useExerciseHistory = (exercises: PrefillExercise[]) => {
  const { sessionLog } = useSessionLog()
  const performanceIndex = buildExercisePerformanceIndex(sessionLog)

  const prefillFor = (exerciseIndex: number) => {
    const exercise = exercises[exerciseIndex]

    return exercise
      ? resolveSetPrefill(performanceIndex, exercise)
      : { weight: DEFAULT_WEIGHT, reps: DEFAULT_REPS }
  }

  const lastSetsFor = (exerciseIndex: number) => {
    const exercise = exercises[exerciseIndex]

    return exercise ? findLastSets(performanceIndex, exercise.libraryExerciseId) : null
  }

  const targetFor = (exerciseIndex: number) => {
    const exercise = exercises[exerciseIndex]

    return exercise ? resolveNextTarget(performanceIndex, exercise) : null
  }

  return { prefillFor, lastSetsFor, targetFor }
}
