import { useState } from 'react'
import { useActiveSessionSnapshot } from '@domains/seance-active/hooks/use-active-session-snapshot'
import { useSessionLog } from '@domains/seance-active/hooks/use-session-log'
import { useSessionStreak } from '@domains/seance-active/hooks/use-session-streak'
import { isSnapshotResumable } from '@domains/seance-active/utils/active-session-snapshot'
import { useSessions } from '@domains/seances/hooks/use-sessions'
import { useEnsurePlanStart, useWeekPlan } from '@domains/seances/hooks/use-week-plan'
import { buildExercisePerformanceIndex } from '@domains/progression/utils/build-exercise-performance-index'
import { computeExerciseRank, rankFromScore } from '@domains/progression/utils/compute-rank'
import { useBodyWeight } from '@domains/profil/hooks/use-body-weight'
import { getSubLevelRoman } from '@domains/progression/utils/get-sub-level-roman'
import { getTierLabel } from '@domains/progression/utils/get-tier-label'
import { useVolumeDistribution } from '@domains/progression/hooks/use-volume-distribution'
import { computeStreakTrend } from '@shared/utils/date/compute-streaks'
import { getTodayLabel } from '@shared/utils/date/get-today-label'
import { getWeekDays } from '@shared/utils/date/get-week-days'
import { toLocalDateKey } from '@shared/utils/date/to-local-date-key'
import { usePostureRoutine } from './use-posture-routine'
import { useSessionPreview } from './use-session-preview'
import type { WeekDayStatus } from '../types/week-day-status'

export const useHomeOverview = () => {
  const today = new Date()
  const todayKey = toLocalDateKey(today)
  const todayMidnight = new Date(today)
  todayMidnight.setHours(0, 0, 0, 0)
  const todayWeekDays = getWeekDays(today)
  const todayIndex = todayWeekDays.find((day) => day.isToday)?.index ?? 0

  const { sessions } = useSessions()
  const { getAssignment, planStartKey } = useWeekPlan()
  const { sessionLog } = useSessionLog()
  const { bodyWeightKg } = useBodyWeight()
  const { musclesOnTarget, trackedMuscleCount } = useVolumeDistribution()
  const posture = usePostureRoutine(todayKey)
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayIndex)
  const [activeSnapshot] = useActiveSessionSnapshot()

  const completedDates = sessionLog.map((entry) => entry.completedAt)
  const streakCurrent = useSessionStreak()
  const streakTrend = computeStreakTrend(completedDates)

  // Un planning déjà en place mais sans date de début (données antérieures) démarre à la première
  // séance enregistrée, ou aujourd'hui.
  const earliestLog = completedDates.reduce<string | undefined>(
    (earliest, date) => (!earliest || date < earliest ? date : earliest),
    undefined,
  )
  useEnsurePlanStart(earliestLog ? toLocalDateKey(new Date(earliestLog)) : undefined)

  const weekDays = todayWeekDays.map((day) => {
    const hasCompletedSession = sessionLog.some(
      (entry) => new Date(entry.completedAt).toDateString() === day.date.toDateString(),
    )
    const assignment = getAssignment(day.index)
    const isTrainingDay = assignment !== 'rest' && assignment !== 'free'
    const isPastDay = day.date.getTime() < todayMidnight.getTime()
    // Un jour prévu avant le début du programme n'est pas « manqué » : il n'existait pas encore.
    const isBeforeProgram = planStartKey !== null && toLocalDateKey(day.date) < planStartKey

    const status: WeekDayStatus = hasCompletedSession
      ? 'done'
      : !isTrainingDay
        ? 'rest'
        : isPastDay
          ? isBeforeProgram
            ? 'before-start'
            : 'missed'
          : 'scheduled'

    return { ...day, status }
  })

  const selectedDay = weekDays.find((day) => day.index === selectedDayIndex) ?? weekDays[todayIndex]
  const selectedDayAssignment = getAssignment(selectedDay.index)
  const selectedSession =
    selectedDayAssignment === 'rest' || selectedDayAssignment === 'free'
      ? undefined
      : sessions.find((session) => session.id === selectedDayAssignment)

  const preview = useSessionPreview(selectedSession?.id)

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
    preview,
    selectedSession: selectedSession
      ? {
          title: selectedSession.name,
          imageUrl: selectedSession.imageUrl,
          exerciseCount: selectedSession.exercises.length,
          durationMinutes: preview?.durationMinutes ?? 0,
        }
      : undefined,
    streak: { current: streakCurrent, trend: streakTrend },
    volumeSummary: { musclesOnTarget, trackedMuscleCount },
    lastExercise,
    weekDays,
    posture,
    hasNoSessions: sessions.length === 0,
  }
}
