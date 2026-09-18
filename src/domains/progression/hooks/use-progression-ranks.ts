import { useSessionLog } from '@domains/seance-active/hooks/use-session-log'
import { MUSCLE_GROUPS } from '@domains/seances/types/muscle-group'
import type { MuscleGroup } from '@domains/seances/types/muscle-group'
import { useBodyWeight } from '@domains/profil/hooks/use-body-weight'
import { buildExercisePerformanceIndex } from '../utils/build-exercise-performance-index'
import { computeExerciseRank, rankFromScore } from '../utils/compute-rank'
import type { RankedItem, RankedItemRecord } from '../types/ranked-item'

// Le rang d'un muscle reflète ses meilleurs exercices, pas une moyenne tirée vers le bas
const TOP_EXERCISES_PER_MUSCLE = 3

export const useProgressionRanks = () => {
  const { sessionLog } = useSessionLog()
  const { bodyWeightKg } = useBodyWeight()
  const index = buildExercisePerformanceIndex(sessionLog)

  const ranked = Array.from(index.values()).flatMap((performance) => {
    const rank = computeExerciseRank(
      performance.exerciseId,
      performance.points.map((point) => point.bestSet),
      bodyWeightKg,
    )

    return rank ? [{ performance, rank }] : []
  })

  const exercises: RankedItem[] = ranked
    .map(({ performance, rank }) => ({
      id: performance.exerciseId,
      name: performance.name,
      photoUrl: performance.thumbnailUrl,
      tier: rank.tier,
      subLevel: rank.subLevel,
      progressPercent: rank.progressPercent,
      nextRankTarget: rank.nextRankTarget,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const scoresByMuscle = new Map<MuscleGroup, number[]>()
  ranked.forEach(({ performance, rank }) => {
    const scores = scoresByMuscle.get(performance.muscleGroup) ?? []
    scores.push(rank.score)
    scoresByMuscle.set(performance.muscleGroup, scores)
  })

  const muscles: RankedItemRecord[] = MUSCLE_GROUPS.filter((muscleGroup) =>
    scoresByMuscle.has(muscleGroup),
  ).map((muscleGroup) => {
    const topScores = (scoresByMuscle.get(muscleGroup) ?? [])
      .sort((a, b) => b - a)
      .slice(0, TOP_EXERCISES_PER_MUSCLE)
    const averageScore = topScores.reduce((total, score) => total + score, 0) / topScores.length

    return { id: muscleGroup, ...rankFromScore(averageScore) }
  })

  return { exercises, muscles }
}
