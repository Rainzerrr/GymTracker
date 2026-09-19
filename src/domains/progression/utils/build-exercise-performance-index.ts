import type { RirValue } from '@domains/seance-active/types/rir-value'
import type { SessionLogEntry } from '@domains/seance-active/types/session-log-entry'
import type { MuscleGroup } from '@domains/seances/types/muscle-group'
import { computeE1rm } from './compute-e1rm'

export type ExercisePerformancePoint = {
  completedAt: string
  value: number
  // Meilleure série de la séance, pour calculer le rang selon les standards de force
  bestSet: { weight: number; reps: number }
  // Toutes les séries valides de la séance, dans l'ordre, pour proposer l'objectif suivant
  sets: { weight: number; reps: number; rir: RirValue | null }[]
}

export type ExercisePerformance = {
  exerciseId: string
  name: string
  thumbnailUrl: string
  muscleGroup: MuscleGroup
  points: ExercisePerformancePoint[]
}

const buildIndex = (sessionLog: SessionLogEntry[]): Map<string, ExercisePerformance> => {
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

      let bestSet = validSets[0]
      let bestValue = computeE1rm(bestSet.weight, bestSet.reps)

      validSets.forEach((set) => {
        const value = computeE1rm(set.weight, set.reps)

        if (value > bestValue) {
          bestSet = set
          bestValue = value
        }
      })

      const point: ExercisePerformancePoint = {
        completedAt: session.completedAt,
        value: bestValue,
        bestSet: { weight: bestSet.weight, reps: bestSet.reps },
        sets: validSets.map(({ weight, reps, rir }) => ({ weight, reps, rir: rir ?? null })),
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

// Plusieurs écrans construisent l'index à chaque rendu à partir du même historique : on le garde
// tant que la référence de l'historique ne change pas. L'index est en lecture seule.
const cache = new WeakMap<SessionLogEntry[], Map<string, ExercisePerformance>>()

export const buildExercisePerformanceIndex = (
  sessionLog: SessionLogEntry[],
): Map<string, ExercisePerformance> => {
  const cached = cache.get(sessionLog)

  if (cached) {
    return cached
  }

  const index = buildIndex(sessionLog)
  cache.set(sessionLog, index)

  return index
}
