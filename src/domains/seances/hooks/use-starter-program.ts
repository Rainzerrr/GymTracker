import { STARTER_PROGRAM } from '../data/starter-programs'
import { buildStarterDrafts } from '../utils/build-starter-drafts'
import { getLibraryExercise } from './use-exercise-library'
import { useSessions } from './use-sessions'
import { useWeekPlan } from './use-week-plan'
import type { WeekPlan } from '../types/day-assignment'

// Installe le programme de départ : ses séances, et leur place dans le planning de la semaine.
export const useStarterProgram = () => {
  const { createSessions } = useSessions()
  const { setAssignments } = useWeekPlan()

  const installStarterProgram = () => {
    const created = createSessions(buildStarterDrafts(STARTER_PROGRAM, getLibraryExercise))
    const assignments: WeekPlan = Object.fromEntries(
      STARTER_PROGRAM.weekLayout.map((sessionIndex, dayIndex) => [
        dayIndex,
        sessionIndex === null ? 'rest' : created[sessionIndex].id,
      ]),
    )

    setAssignments(assignments)
  }

  return { installStarterProgram }
}
