import { useSessionLog } from '@domains/seance-active/hooks/use-session-log'
import { MUSCLE_GROUPS } from '@domains/seances/types/muscle-group'
import { getStartOfWeek } from '@shared/utils/date/get-start-of-week'
import type { MuscleVolume, VolumeStatus } from '../types/volume-status'

const WEEKLY_TARGET_SETS = 10

export const useVolumeDistribution = () => {
  const { sessionLog } = useSessionLog()

  const startOfWeek = getStartOfWeek()
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(endOfWeek.getDate() + 7)

  const setsByMuscle = new Map<string, number>()
  sessionLog
    .filter((entry) => {
      const completedAt = new Date(entry.completedAt)
      return completedAt >= startOfWeek && completedAt < endOfWeek
    })
    .forEach((entry) => {
      entry.exercises.forEach((exercise) => {
        const sets = exercise.sets.filter((set) => set.reps > 0).length
        setsByMuscle.set(exercise.muscleGroup, (setsByMuscle.get(exercise.muscleGroup) ?? 0) + sets)
      })
    })

  const muscleVolumes: MuscleVolume[] = MUSCLE_GROUPS.map((muscleGroup) => {
    const sets = setsByMuscle.get(muscleGroup) ?? 0
    const status: VolumeStatus =
      sets === 0 ? 'none' : sets < WEEKLY_TARGET_SETS ? 'under' : 'target'

    return { muscleGroup, status }
  })

  const musclesUnderTarget = muscleVolumes.filter((muscle) => muscle.status === 'under').length

  return { muscleVolumes, musclesUnderTarget }
}
