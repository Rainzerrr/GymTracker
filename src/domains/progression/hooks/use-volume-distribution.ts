import { useSessionLog } from '@domains/seance-active/hooks/use-session-log'
import { getLibraryExercise } from '@domains/seances/hooks/use-exercise-library'
import type { Muscle } from '@domains/seances/types/muscle'
import { getStartOfWeek } from '@shared/utils/date/get-start-of-week'
import { INDIRECT_SET_WEIGHT, MUSCLE_REGIONS } from '../data/muscle-config'
import { useVolumeTargets } from './use-volume-targets'
import type { MuscleContribution, MuscleVolume } from '../types/volume-status'
import { getVolumeStatus } from '../utils/get-volume-status'

const MUSCLES: Muscle[] = MUSCLE_REGIONS.flatMap(({ muscles }) => muscles)

export const useVolumeDistribution = () => {
  const { sessionLog } = useSessionLog()
  const { targets } = useVolumeTargets()

  const startOfWeek = getStartOfWeek()
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(endOfWeek.getDate() + 7)

  const contributionsByMuscle = new Map<Muscle, Map<string, MuscleContribution>>()

  const addContribution = (
    muscle: Muscle,
    exercise: { libraryExerciseId: string; name: string; thumbnailUrl: string },
    sets: number,
    isDirect: boolean,
  ) => {
    const contributions = contributionsByMuscle.get(muscle) ?? new Map<string, MuscleContribution>()
    const existing = contributions.get(exercise.libraryExerciseId)

    contributions.set(exercise.libraryExerciseId, {
      exerciseId: exercise.libraryExerciseId,
      name: exercise.name,
      thumbnailUrl: exercise.thumbnailUrl,
      sets: (existing?.sets ?? 0) + sets,
      isDirect,
    })
    contributionsByMuscle.set(muscle, contributions)
  }

  sessionLog
    .filter((entry) => {
      const completedAt = new Date(entry.completedAt)
      return completedAt >= startOfWeek && completedAt < endOfWeek
    })
    .forEach((entry) => {
      entry.exercises.forEach((exercise) => {
        const sets = exercise.sets.filter((set) => set.reps > 0).length
        const libraryExercise = getLibraryExercise(exercise.libraryExerciseId)

        if (sets === 0 || !libraryExercise) {
          return
        }

        libraryExercise.primaryMuscles.forEach((muscle) =>
          addContribution(muscle, exercise, sets, true),
        )
        libraryExercise.secondaryMuscles.forEach((muscle) =>
          addContribution(muscle, exercise, sets, false),
        )
      })
    })

  const muscleVolumes: MuscleVolume[] = MUSCLES.map((muscle) => {
    const contributions = [...(contributionsByMuscle.get(muscle)?.values() ?? [])].sort(
      (a, b) => Number(b.isDirect) - Number(a.isDirect) || b.sets - a.sets,
    )
    const directSets = contributions.filter((c) => c.isDirect).reduce((sum, c) => sum + c.sets, 0)
    const indirectSets = contributions
      .filter((c) => !c.isDirect)
      .reduce((sum, c) => sum + c.sets, 0)
    const effectiveSets = directSets + indirectSets * INDIRECT_SET_WEIGHT
    const targetSets = targets[muscle]

    return {
      muscle,
      status: getVolumeStatus(effectiveSets, targetSets),
      directSets,
      indirectSets,
      effectiveSets,
      targetSets,
      contributions,
    }
  })

  const musclesUnderTarget = muscleVolumes.filter(
    ({ status }) => status !== 'none' && status !== 'target',
  ).length

  return { muscleVolumes, musclesUnderTarget }
}
