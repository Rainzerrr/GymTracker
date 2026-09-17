import { useSessions } from '@domains/seances/hooks/use-sessions'
import { useWeekPlan } from '@domains/seances/hooks/use-week-plan'
import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import { getTodayLabel } from '@shared/utils/date/get-today-label'
import { getWeekDays } from '@shared/utils/date/get-week-days'
import homeOverview from '../data/home-overview.json'
import type { WeekDayStatus } from '../types/week-day-status'

const weekPlanStatus: Record<string, WeekDayStatus> = homeOverview.weekPlan as Record<string, WeekDayStatus>
const ESTIMATED_MINUTES_PER_EXERCISE = 12

export const useHomeOverview = () => {
  const today = new Date()
  const todayIso = today.toISOString().slice(0, 10)
  const todayWeekDays = getWeekDays(today)
  const todayIndex = todayWeekDays.find((day) => day.isToday)?.index ?? 0

  const { sessions } = useSessions()
  const { getAssignment } = useWeekPlan()
  const [postureValidated, setPostureValidated] = useLocalStorageState(
    `home/posture-routine-validated/${todayIso}`,
    false,
  )

  const weekDays = todayWeekDays.map((day) => ({
    ...day,
    status: weekPlanStatus[String(day.index)] ?? 'none',
  }))

  const todayAssignment = getAssignment(todayIndex)
  const todaySession =
    todayAssignment === 'rest' || todayAssignment === 'free'
      ? undefined
      : sessions.find((session) => session.id === todayAssignment)

  return {
    todayLabel: getTodayLabel(today),
    isRestDay: !todaySession,
    todaySessionId: todaySession?.id,
    todaySession: todaySession
      ? {
          title: todaySession.name,
          imageUrl: todaySession.imageUrl,
          exerciseCount: todaySession.exercises.length,
          durationMinutes: todaySession.exercises.length * ESTIMATED_MINUTES_PER_EXERCISE,
        }
      : undefined,
    streak: homeOverview.streak,
    volumeSummary: homeOverview.volumeSummary,
    lastExercise: homeOverview.lastExercise,
    weekDays,
    postureValidated,
    validatePosture: () => setPostureValidated(true),
  }
}
