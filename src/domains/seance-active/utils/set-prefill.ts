import type { ExercisePerformance } from '@domains/progression/utils/build-exercise-performance-index'

export const DEFAULT_REPS = 8
export const DEFAULT_WEIGHT = 20

export type SetPrefill = {
  weight: number
  reps: number
}

/**
 * Valeurs proposées au début d'un exercice : la meilleure série de la dernière séance où il a été
 * fait, ou des valeurs génériques s'il n'a jamais été fait.
 */
export const resolveSetPrefill = (
  performanceIndex: Map<string, ExercisePerformance>,
  libraryExerciseId: string,
): SetPrefill => {
  const points = performanceIndex.get(libraryExerciseId)?.points ?? []
  const lastPoint = points[points.length - 1]

  return lastPoint
    ? { weight: lastPoint.bestSet.weight, reps: lastPoint.bestSet.reps }
    : { weight: DEFAULT_WEIGHT, reps: DEFAULT_REPS }
}
