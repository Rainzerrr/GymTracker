import { useState } from 'react'
import { useActiveSessionSnapshot } from '@domains/seance-active/hooks/use-active-session-snapshot'
import { useSessionLog } from '@domains/seance-active/hooks/use-session-log'
import { isSnapshotResumable } from '@domains/seance-active/utils/active-session-snapshot'
import { useSessions } from '@domains/seances/hooks/use-sessions'
import { useWeekPlan } from '@domains/seances/hooks/use-week-plan'
import { buildExercisePerformanceIndex } from '@domains/progression/utils/build-exercise-performance-index'
import { computeExerciseRank, rankFromScore } from '@domains/progression/utils/compute-rank'
import { useBodyWeight } from '@domains/profil/hooks/use-body-weight'
import { getSubLevelRoman } from '@domains/progression/utils/get-sub-level-roman'
import { getTierLabel } from '@domains/progression/utils/get-tier-label'
import { useVolumeDistribution } from '@domains/progression/hooks/use-volume-distribution'
import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import { computeStreakTrend, computeStreaks } from '@shared/utils/date/compute-streaks'
import { getTodayLabel } from '@shared/utils/date/get-today-label'
import { getWeekDays } from '@shared/utils/date/get-week-days'
import { toLocalDateKey } from '@shared/utils/date/to-local-date-key'
import type { WeekDayStatus } from '../types/week-day-status'

const ESTIMATED_MINUTES_PER_EXERCISE = 12

export const useHomeOverview = () => {
  const today = new Date()
  const todayKey = toLocalDateKey(today)
  const todayMidnight = new Date(today)
  todayMidnight.setHours(0, 0, 0, 0)
  const todayWeekDays = getWeekDays(today)
  const todayIndex = todayWeekDays.find((day) => day.isToday)?.index ?? 0

  const { sessions } = useSessions()
  const { getAssignment } = useWeekPlan()
  const { sessionLog } = useSessionLog()
  const { bodyWeightKg } = useBodyWeight()
  const { musclesUnderTarget } = useVolumeDistribution()
  const [postureValidated, setPostureValidated] = useLocalStorageState(
    `home/posture-routine-validated/${todayKey}`,
    false,
  )
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayIndex)
  const [activeSnapshot] = useActiveSessionSnapshot()

  const completedDates = sessionLog.map((entry) => entry.completedAt)
  const { current: streakCurrent } = computeStreaks(completedDates)
  const streakTrend = computeStreakTrend(completedDates)

  const weekDays = todayWeekDays.map((day) => {
    const hasCompletedSession = sessionLog.some(
      (entry) => new Date(entry.completedAt).toDateString() === day.date.toDateString(),
    )
    const assignment = getAssignment(day.index)
    const isTrainingDay = assignment !== 'rest' && assignment !== 'free'
    const isPastDay = day.date.getTime() < todayMidnight.getTime()

    const status: WeekDayStatus = hasCompletedSession
      ? 'done'
      : !isTrainingDay
        ? 'rest'
        : isPastDay
          ? 'missed'
          : 'scheduled'

    return { ...day, status }
  })

  const selectedDay = weekDays.find((day) => day.index === selectedDayIndex) ?? weekDays[todayIndex]
  const selectedDayAssignment = getAssignment(selectedDay.index)
  const selectedSession =
    selectedDayAssignment === 'rest' || selectedDayAssignment === 'free'
      ? undefined
      : sessions.find((session) => session.id === selectedDayAssignment)

  const hasResumableSession = isSnapshotResumable(
    activeSnapshot,
    selectedSession?.id,
    selectedSession?.exercises.length ?? 0,
    today.getTime(),
  )

  const sortedLog = [...sessionLog].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  )
  const lastSession = sortedLog[0]
  const lastExerciseEntry = lastSession?.exercises[lastSession.exercises.length - 1]
  const performanceIndex = buildExercisePerformanceIndex(sessionLog)

  const lastExercise = lastExerciseEntry
    ? {
        name: lastExerciseEntry.name,
        thumbnailUrl: lastExerciseEntry.thumbnailUrl,
        rankLabel: (() => {
          const performance = performanceIndex.get(lastExerciseEntry.libraryExerciseId)
          const rank =
            computeExerciseRank(
              lastExerciseEntry.libraryExerciseId,
              (performance?.points ?? []).map((point) => point.bestSet),
              bodyWeightKg,
            ) ?? rankFromScore(0)

          return `${getTierLabel(rank.tier)} ${getSubLevelRoman(rank.subLevel)}`
        })(),
      }
    : undefined

  return {
    selectedDayLabel: getTodayLabel(selectedDay.date),
    selectedDayDateIso: selectedDay.date.toISOString(),
    selectedDayStatus: selectedDay.status,
    isSelectedDayToday: selectedDay.isToday,
    selectedDayIndex: selectedDay.index,
    selectDay: setSelectedDayIndex,
    isRestDay: !selectedSession,
    hasResumableSession,
    selectedSessionId: selectedSession?.id,
    selectedSession: selectedSession
      ? {
          title: selectedSession.name,
          imageUrl: selectedSession.imageUrl,
          exerciseCount: selectedSession.exercises.length,
          durationMinutes: selectedSession.exercises.length * ESTIMATED_MINUTES_PER_EXERCISE,
        }
      : undefined,
    streak: { current: streakCurrent, trend: streakTrend },
    volumeSummary: { musclesUnderTarget },
    lastExercise,
    weekDays,
    postureValidated,
    validatePosture: () => setPostureValidated(true),
  }
}
