import { useSessionLog } from '@domains/seance-active/hooks/use-session-log'
import { getLibraryExercise } from '@domains/seances/hooks/use-exercise-library'
import { MUSCLE_GROUPS } from '@domains/seances/types/muscle-group'
import type { MuscleGroup } from '@domains/seances/types/muscle-group'
import { buildExercisePerformanceIndex } from '../utils/build-exercise-performance-index'
import {
  computeImprovementScore,
  computeNextRankTargetValue,
  computeRankFromScore,
} from '../utils/compute-rank'
import type { NextRankTarget, RankedItem, RankedItemRecord } from '../types/ranked-item'

export const useProgressionRanks = () => {
  const { sessionLog } = useSessionLog()
  const index = buildExercisePerformanceIndex(sessionLog)

  const exercises: RankedItem[] = Array.from(index.values())
    .map((performance) => {
      const values = performance.points.map((point) => point.value)
      const baseline = values[0]
      const best = Math.max(...values)
      const score = computeImprovementScore(values)
      const isBodyweight = getLibraryExercise(performance.exerciseId)?.equipment === 'Poids du corps'
      const target = computeNextRankTargetValue(baseline, best, score)

      const nextRankTarget: NextRankTarget | null = target
        ? {
            value: isBodyweight ? Math.round(target.value) : Math.round(target.value * 10) / 10,
            remaining: isBodyweight
              ? Math.round(target.remaining)
              : Math.round(target.remaining * 10) / 10,
            unit: isBodyweight ? 'reps' : 'kg',
          }
        : null

      return {
        id: performance.exerciseId,
        name: performance.name,
        photoUrl: performance.thumbnailUrl,
        ...computeRankFromScore(score),
        nextRankTarget,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const scoresByMuscle = new Map<MuscleGroup, number[]>()
  index.forEach((performance) => {
    const score = computeImprovementScore(performance.points.map((point) => point.value))
    const scores = scoresByMuscle.get(performance.muscleGroup) ?? []
    scores.push(score)
    scoresByMuscle.set(performance.muscleGroup, scores)
  })

  const muscles: RankedItemRecord[] = MUSCLE_GROUPS.filter((muscleGroup) =>
    scoresByMuscle.has(muscleGroup),
  ).map((muscleGroup) => {
    const scores = scoresByMuscle.get(muscleGroup) ?? []
    const averageScore = scores.reduce((total, score) => total + score, 0) / scores.length

    return { id: muscleGroup, ...computeRankFromScore(averageScore) }
  })

  return { exercises, muscles }
}
