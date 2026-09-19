import type { ExercisePerformance } from '@domains/progression/utils/build-exercise-performance-index'
import { suggestNextTarget } from '@domains/progression/utils/suggest-next-target'
import type { NextTarget, TargetSet } from '@domains/progression/utils/suggest-next-target'
import type { RepRange } from '@domains/seances/utils/parse-rep-range'

export const DEFAULT_REPS = 8
export const DEFAULT_WEIGHT = 20

export type SetPrefill = {
  weight: number
  reps: number
}

// Ce qu'il faut savoir d'un exercice pour proposer sa prochaine charge.
export type PrefillExercise = {
  libraryExerciseId: string
  repRange: RepRange | null
  weightIncrement: number
  isBodyweight: boolean
}

// Séries de la dernière séance où l'exercice a été fait, ou null s'il ne l'a jamais été.
export const findLastSets = (
  performanceIndex: Map<string, ExercisePerformance>,
  libraryExerciseId: string,
): TargetSet[] | null => {
  const points = performanceIndex.get(libraryExerciseId)?.points ?? []

  return points[points.length - 1]?.sets ?? null
}

// Objectif de la prochaine séance sur cet exercice, ou null s'il n'a jamais été fait.
export const resolveNextTarget = (
  performanceIndex: Map<string, ExercisePerformance>,
  exercise: PrefillExercise,
): NextTarget | null => {
  const lastSets = findLastSets(performanceIndex, exercise.libraryExerciseId)

  return lastSets
    ? suggestNextTarget({
        lastSets,
        repRange: exercise.repRange,
        weightIncrement: exercise.weightIncrement,
        isBodyweight: exercise.isBodyweight,
      })
    : null
}

/**
 * Valeurs proposées au début d'un exercice : l'objectif issu de la dernière séance (même charge
 * ou charge supérieure), ou des valeurs génériques s'il n'a jamais été fait.
 */
export const resolveSetPrefill = (
  performanceIndex: Map<string, ExercisePerformance>,
  exercise: PrefillExercise,
): SetPrefill => {
  const target = resolveNextTarget(performanceIndex, exercise)

  return target
    ? { weight: target.weight, reps: target.reps }
    : { weight: DEFAULT_WEIGHT, reps: exercise.repRange?.min ?? DEFAULT_REPS }
}
