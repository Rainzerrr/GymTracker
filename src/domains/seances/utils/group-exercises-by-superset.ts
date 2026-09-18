import type { SessionExercise } from '../types/session-exercise'

export const groupExercisesBySuperset = (exercises: SessionExercise[]): SessionExercise[][] => {
  const groups: SessionExercise[][] = []

  exercises.forEach((exercise, index) => {
    const previous = exercises[index - 1]

    if (index === 0 || !previous.linkedToNext) {
      groups.push([exercise])
    } else {
      groups[groups.length - 1].push(exercise)
    }
  })

  return groups
}
