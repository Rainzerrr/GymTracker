import { useEffect } from 'react'
import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import { toLocalDateKey } from '@shared/utils/date/to-local-date-key'
import { isRecord } from '@shared/utils/storage/guards'
import defaultWeekPlan from '../data/default-week-plan.json'
import type { DayAssignmentValue, WeekPlan } from '../types/day-assignment'

const STORAGE_KEY = 'seances/week-plan'
const PLAN_START_STORAGE_KEY = 'seances/plan-start'

const isNullableString = (value: unknown): value is string | null =>
  value === null || typeof value === 'string'

const hasTrainingDay = (plan: WeekPlan) =>
  Object.values(plan).some((assignment) => assignment !== 'rest' && assignment !== 'free')

export const useWeekPlan = () => {
  const [weekPlan, setWeekPlan] = useLocalStorageState<WeekPlan>(
    STORAGE_KEY,
    defaultWeekPlan as WeekPlan,
    { isValid: isRecord<WeekPlan> },
  )
  // Jour (AAAA-MM-JJ) où le programme a démarré : avant, une séance prévue n'est pas « manquée ».
  const [planStartKey, setPlanStartKey] = useLocalStorageState<string | null>(
    PLAN_START_STORAGE_KEY,
    null,
    { isValid: isNullableString },
  )

  const getAssignment = (dayIndex: number): DayAssignmentValue => weekPlan[dayIndex] ?? 'free'

  // Le programme démarre le jour où l'on planifie sa première séance.
  const savePlan = (next: WeekPlan) => {
    setWeekPlan(next)

    if (planStartKey === null && hasTrainingDay(next)) {
      setPlanStartKey(toLocalDateKey(new Date()))
    }
  }

  const setAssignment = (dayIndex: number, value: DayAssignmentValue) => {
    savePlan({ ...weekPlan, [dayIndex]: value })
  }

  const setAssignments = (assignments: WeekPlan) => {
    savePlan({ ...weekPlan, ...assignments })
  }

  return {
    weekPlan,
    planStartKey,
    hasTrainingDay: hasTrainingDay(weekPlan),
    setPlanStartKey,
    getAssignment,
    setAssignment,
    setAssignments,
  }
}

/**
 * Données créées avant que la date de début existe : un planning déjà en place sans date de début
 * démarre à la première séance enregistrée, ou à défaut aujourd'hui (les jours passés de la
 * semaine ne sont alors pas comptés comme manqués).
 */
export const useEnsurePlanStart = (earliestLogKey: string | undefined) => {
  const { planStartKey, hasTrainingDay: hasPlan, setPlanStartKey } = useWeekPlan()

  useEffect(() => {
    if (planStartKey === null && hasPlan) {
      setPlanStartKey(earliestLogKey ?? toLocalDateKey(new Date()))
    }
  }, [planStartKey, hasPlan, earliestLogKey, setPlanStartKey])
}
