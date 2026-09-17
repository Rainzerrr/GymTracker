import { useSessionLog } from '@domains/seance-active/hooks/use-session-log'
import type { MuscleGroup } from '@domains/seances/types/muscle-group'
import { computeStreaks } from '@shared/utils/date/compute-streaks'

export type MuscleSplitItem = {
  muscleGroup: MuscleGroup
  sets: number
  percent: number
}

export const useProfilOverview = () => {
  const { sessionLog } = useSessionLog()

  const sessionsCompletedCount = sessionLog.length
  const totalMinutesTrained = sessionLog.reduce((total, entry) => total + entry.durationMinutes, 0)

  const setsByMuscle = new Map<MuscleGroup, number>()
  let totalSets = 0
  sessionLog.forEach((entry) => {
    entry.exercises.forEach((exercise) => {
      const sets = exercise.sets.length
      setsByMuscle.set(exercise.muscleGroup, (setsByMuscle.get(exercise.muscleGroup) ?? 0) + sets)
      totalSets += sets
    })
  })

  const muscleSplit: MuscleSplitItem[] = Array.from(setsByMuscle, ([muscleGroup, sets]) => ({
    muscleGroup,
    sets,
    percent: totalSets > 0 ? Math.round((sets / totalSets) * 100) : 0,
  })).sort((a, b) => b.sets - a.sets)

  const { current: currentStreakDays, longest: longestStreakDays } = computeStreaks(
    sessionLog.map((entry) => entry.completedAt),
  )

  const recentEntries = [...sessionLog]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5)

  return {
    sessionsCompletedCount,
    totalMinutesTrained,
    totalSets,
    currentStreakDays,
    longestStreakDays,
    muscleSplit,
    recentEntries,
  }
}
