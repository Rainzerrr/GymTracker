import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import defaultWeekPlan from '../data/default-week-plan.json'
import type { DayAssignmentValue, WeekPlan } from '../types/day-assignment'

const STORAGE_KEY = 'seances/week-plan'

export const useWeekPlan = () => {
  const [weekPlan, setWeekPlan] = useLocalStorageState<WeekPlan>(STORAGE_KEY, defaultWeekPlan as WeekPlan)

  const getAssignment = (dayIndex: number): DayAssignmentValue => weekPlan[dayIndex] ?? 'free'

  const setAssignment = (dayIndex: number, value: DayAssignmentValue) => {
    setWeekPlan({ ...weekPlan, [dayIndex]: value })
  }

  return { weekPlan, getAssignment, setAssignment }
}
