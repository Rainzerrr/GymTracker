import { useSessionLog } from '@domains/seance-active/hooks/use-session-log'
import { MUSCLE_GROUPS } from '@domains/seances/types/muscle-group'
import type { MuscleGroup } from '@domains/seances/types/muscle-group'
import { buildExercisePerformanceIndex } from '../utils/build-exercise-performance-index'
import { computeImprovementScore, computeRankFromScore } from '../utils/compute-rank'
import type { RankedItem, RankedItemRecord } from '../types/ranked-item'

export const useProgressionRanks = () => {
  const { sessionLog } = useSessionLog()
  const index = buildExercisePerformanceIndex(sessionLog)

  const exercises: RankedItem[] = Array.from(index.values())
    .map((performance) => ({
      id: performance.exerciseId,
      name: performance.name,
      photoUrl: performance.thumbnailUrl,
      ...computeRankFromScore(
        computeImprovementScore(performance.points.map((point) => point.value)),
      ),
    }))
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
