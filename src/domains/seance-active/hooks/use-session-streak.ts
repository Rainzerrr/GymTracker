import { useSessions } from '@domains/seances/hooks/use-sessions'
import { useWeekPlan } from '@domains/seances/hooks/use-week-plan'
import { computeSessionStreak } from '@shared/utils/date/compute-session-streak'
import type { DayKind } from '@shared/utils/date/compute-session-streak'
import { useSessionLog } from './use-session-log'

// Streak de séances en tenant compte du planning : voir `computeSessionStreak`.
export const useSessionStreak = (): number => {
  const { sessionLog } = useSessionLog()
  const { sessions } = useSessions()
  const { getAssignment, planStartKey } = useWeekPlan()

  const getDayKind = (date: Date): DayKind => {
    // Le planning commence le lundi (0) alors que `getDay()` commence le dimanche (0).
    const assignment = getAssignment((date.getDay() + 6) % 7)

    if (assignment === 'rest' || assignment === 'free') {
      return assignment
    }

    // Une séance supprimée du programme laisse un jour libre.
    return sessions.some((session) => session.id === assignment) ? 'training' : 'free'
  }

  return computeSessionStreak({
    completedAtDates: sessionLog.map((entry) => entry.completedAt),
    getDayKind,
    programStartKey: planStartKey,
  })
}
