import type { SessionLogEntry } from '@domains/seance-active/types/session-log-entry'
import type { MuscleGroup } from '@domains/seances/types/muscle-group'
import { computeE1rm } from './compute-e1rm'

export type ExercisePerformancePoint = {
  completedAt: string
  value: number
  // Meilleure série de la séance, pour calculer le rang selon les standards de force
  bestSet: { weight: number; reps: number }
}

export type ExercisePerformance = {
  exerciseId: string
  name: string
  thumbnailUrl: string
  muscleGroup: MuscleGroup
  points: ExercisePerformancePoint[]
}

export const buildExercisePerformanceIndex = (
  sessionLog: SessionLogEntry[],
): Map<string, ExercisePerformance> => {
  const chronological = [...sessionLog].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
  )

  const index = new Map<string, ExercisePerformance>()

  chronological.forEach((session) => {
    session.exercises.forEach((exercise) => {
      const validSets = exercise.sets.filter((set) => set.reps > 0)

      if (validSets.length === 0) {
        return
      }

      const bestSet = validSets.reduce((currentBest, set) =>
        computeE1rm(set.weight, set.reps) > computeE1rm(currentBest.weight, currentBest.reps)
          ? set
          : currentBest,
      )
      const point: ExercisePerformancePoint = {
        completedAt: session.completedAt,
        value: computeE1rm(bestSet.weight, bestSet.reps),
        bestSet: { weight: bestSet.weight, reps: bestSet.reps },
      }
      const existing = index.get(exercise.libraryExerciseId)

      if (existing) {
        existing.points.push(point)
      } else {
        index.set(exercise.libraryExerciseId, {
          exerciseId: exercise.libraryExerciseId,
          name: exercise.name,
          thumbnailUrl: exercise.thumbnailUrl,
          muscleGroup: exercise.muscleGroup,
          points: [point],
        })
      }
    })
  })

  return index
}
