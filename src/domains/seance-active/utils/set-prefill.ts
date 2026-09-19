import type { ExercisePerformance } from '@domains/progression/utils/build-exercise-performance-index'

export const DEFAULT_REPS = 8
export const DEFAULT_WEIGHT = 20

export type SetPrefill = {
  weight: number
  reps: number
}

// Meilleure série de la dernière séance où l'exercice a été fait, ou null s'il ne l'a jamais été.
export const findLastPerformance = (
  performanceIndex: Map<string, ExercisePerformance>,
  libraryExerciseId: string,
): SetPrefill | null => {
  const points = performanceIndex.get(libraryExerciseId)?.points ?? []
  const lastPoint = points[points.length - 1]

  return lastPoint ? { weight: lastPoint.bestSet.weight, reps: lastPoint.bestSet.reps } : null
}

/**
 * Valeurs proposées au début d'un exercice : la dernière performance, ou des valeurs génériques
 * s'il n'a jamais été fait.
 */
export const resolveSetPrefill = (
  performanceIndex: Map<string, ExercisePerformance>,
  libraryExerciseId: string,
): SetPrefill =>
  findLastPerformance(performanceIndex, libraryExerciseId) ?? {
    weight: DEFAULT_WEIGHT,
    reps: DEFAULT_REPS,
  }
