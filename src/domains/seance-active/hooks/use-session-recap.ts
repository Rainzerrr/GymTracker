import { buildExercisePerformanceIndex } from '@domains/progression/utils/build-exercise-performance-index'
import { computeE1rm } from '@domains/progression/utils/compute-e1rm'
import { computeExerciseRank } from '@domains/progression/utils/compute-rank'
import { useBodyWeight } from '@domains/profil/hooks/use-body-weight'
import { computeSessionXp } from '@domains/progression/utils/compute-session-xp'
import { usePlayerLevel } from '@domains/progression/hooks/use-player-level'
import { TIERS } from '@domains/progression/types/tier'
import type { Tier } from '@domains/progression/types/tier'
import { getLibraryExercise } from '@domains/seances/hooks/use-exercise-library'
import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import { computeStreaks } from '@shared/utils/date/compute-streaks'
import { useSessionLog } from './use-session-log'
import type { SessionSummary } from '../types/session-summary'

export type SessionRecapHighlightFact =
  | { kind: 'pr'; exerciseName: string; isBodyweight: boolean; value: number }
  | { kind: 'tierUp'; exerciseName: string; tier: Tier }
  | { kind: 'streak'; days: number }
  | { kind: 'first' }

const STREAK_HIGHLIGHT_MIN_DAYS = 2

export const useSessionRecap = () => {
  const [summary] = useLocalStorageState<SessionSummary | null>('seance-active/last-summary', null)
  const { sessionLog } = useSessionLog()
  const { level, levelTitle, currentXp, xpToNextLevel } = usePlayerLevel()
  const { bodyWeightKg } = useBodyWeight()

  const sortedLog = [...sessionLog].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  )
  const lastEntry = sortedLog[0]

  if (!summary || !lastEntry) {
    return {
      summary,
      xpGained: 0,
      level,
      levelTitle,
      currentXp,
      xpToNextLevel,
      highlights: [] as SessionRecapHighlightFact[],
    }
  }

  const xpGained = computeSessionXp(lastEntry.exercises)

  const priorLog = sessionLog.filter((session) => session.id !== lastEntry.id)
  const priorIndex = buildExercisePerformanceIndex(priorLog)
  const fullIndex = buildExercisePerformanceIndex(sessionLog)

  const highlights: SessionRecapHighlightFact[] = []

  lastEntry.exercises.forEach((exercise) => {
    const bestThisSession = Math.max(
      ...exercise.sets.map((set) => computeE1rm(set.weight, set.reps)),
    )
    const prior = priorIndex.get(exercise.libraryExerciseId)

    if (!prior || prior.points.length === 0) {
      return
    }

    const isBodyweight =
      getLibraryExercise(exercise.libraryExerciseId)?.equipment === 'Poids du corps'
    const priorBest = Math.max(...prior.points.map((point) => point.value))

    if (bestThisSession > priorBest) {
      highlights.push({
        kind: 'pr',
        exerciseName: exercise.name,
        isBodyweight,
        value: bestThisSession,
      })
    }

    const priorRank = computeExerciseRank(
      exercise.libraryExerciseId,
      prior.points.map((point) => point.bestSet),
      bodyWeightKg,
    )
    const afterRank = computeExerciseRank(
      exercise.libraryExerciseId,
      (fullIndex.get(exercise.libraryExerciseId)?.points ?? []).map((point) => point.bestSet),
      bodyWeightKg,
    )

    if (!priorRank || !afterRank) {
      return
    }

    if (TIERS.indexOf(afterRank.tier) > TIERS.indexOf(priorRank.tier)) {
      highlights.push({ kind: 'tierUp', exerciseName: exercise.name, tier: afterRank.tier })
    }
  })

  const { current: streakDays } = computeStreaks(sessionLog.map((session) => session.completedAt))
  if (streakDays >= STREAK_HIGHLIGHT_MIN_DAYS) {
    highlights.push({ kind: 'streak', days: streakDays })
  }

  if (highlights.length === 0) {
    highlights.push({ kind: 'first' })
  }

  return { summary, xpGained, level, levelTitle, currentXp, xpToNextLevel, highlights }
}
