import type { ExerciseLogEntry } from '@domains/seance-active/types/exercise-log-entry'
import type { SetLogEntry } from '@domains/seance-active/types/set-log-entry'

const BASE_XP_PER_SET = 10

const computeRirBonus = (rir: SetLogEntry['rir']): number => {
  if (rir === 'echec' || rir === '0') {
    return 8
  }

  if (rir === '1') {
    return 4
  }

  return 0
}

export const computeSessionXp = (exercises: ExerciseLogEntry[]): number => {
  return exercises.reduce((sessionTotal, exercise) => {
    const exerciseXp = exercise.sets.reduce((setTotal, set) => {
      const volume = set.weight > 0 ? set.weight * set.reps : set.reps * 3

      return setTotal + BASE_XP_PER_SET + Math.round(volume / 10) + computeRirBonus(set.rir)
    }, 0)

    return sessionTotal + exerciseXp
  }, 0)
}
