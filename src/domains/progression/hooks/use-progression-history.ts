import { useSessionLog } from '@domains/seance-active/hooks/use-session-log'
import { getLibraryExercise } from '@domains/seances/hooks/use-exercise-library'
import { formatShortDateLabel } from '@shared/utils/date/format-date-label'
import { buildExercisePerformanceIndex } from '../utils/build-exercise-performance-index'
import { useBodyWeight } from '@domains/profil/hooks/use-body-weight'
import { computeExerciseRank, rankFromScore } from '../utils/compute-rank'
import { computeSessionXp } from '../utils/compute-session-xp'
import { getTierLabel } from '../utils/get-tier-label'
import { TIERS } from '../types/tier'
import type {
  ExerciseProgressMilestone,
  ExerciseProgressSeries,
} from '../types/exercise-progress-series'
import type { HistoryEntry } from '../types/history-entry'

const MIN_POINTS_FOR_CHART = 1

export const useProgressionHistory = () => {
  const { sessionLog } = useSessionLog()
  const { bodyWeightKg } = useBodyWeight()

  const totalSessionsCount = sessionLog.length

  const entries: HistoryEntry[] = [...sessionLog]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .map((session) => ({
      id: session.id,
      dateLabel: formatShortDateLabel(session.completedAt),
      sessionName: session.sessionName,
      metaLabel: `${session.durationMinutes} min`,
      xpGained: computeSessionXp(session.exercises),
      thumbnailUrl: session.imageUrl,
    }))

  const index = buildExercisePerformanceIndex(sessionLog)

  const charts: ExerciseProgressSeries[] = Array.from(index.values())
    .filter((performance) => performance.points.length >= MIN_POINTS_FOR_CHART)
    .map((performance) => {
      const values = performance.points.map((point) => point.value)
      const bestSets = performance.points.map((point) => point.bestSet)
      const rank =
        computeExerciseRank(performance.exerciseId, bestSets, bodyWeightKg) ?? rankFromScore(0)
      const isBodyweight =
        getLibraryExercise(performance.exerciseId)?.equipment === 'Poids du corps'

      const priorSets = bestSets.slice(0, -1)
      const priorRank =
        priorSets.length > 0 ? computeExerciseRank(performance.exerciseId, priorSets, bodyWeightKg) : null
      const hasTieredUp =
        priorRank !== null && TIERS.indexOf(rank.tier) > TIERS.indexOf(priorRank.tier)

      const milestone: ExerciseProgressMilestone | undefined = hasTieredUp
        ? { title: performance.name, subtitle: `Passage au rang ${getTierLabel(rank.tier)}` }
        : undefined

      return {
        exerciseId: performance.exerciseId,
        exerciseName: performance.name,
        tier: rank.tier,
        subLevel: rank.subLevel,
        unit: isBodyweight ? 'reps' : 'kg',
        points: values.map((value) => Math.round(value * 10) / 10),
        dateLabels: performance.points.map((point) => formatShortDateLabel(point.completedAt)),
        milestone,
      }
    })
    .sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))

  return { totalSessionsCount, entries, charts }
}
