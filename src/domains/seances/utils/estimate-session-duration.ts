const SECONDS_PER_SET = 45
const SECONDS_BETWEEN_EXERCISES = 60
const ROUNDING_MINUTES = 5

type EstimatedExercise = { setCount: number; restSeconds: number }

/**
 * Durée d'une séance à partir de son contenu : temps d'effort par série, repos entre les
 * séries (pas après la dernière d'un exercice) et changement de poste. Arrondie à 5 min.
 */
export const estimateSessionMinutes = (exercises: EstimatedExercise[]): number => {
  if (exercises.length === 0) {
    return 0
  }

  const totalSeconds = exercises.reduce(
    (total, { setCount, restSeconds }) =>
      total + setCount * SECONDS_PER_SET + Math.max(0, setCount - 1) * restSeconds,
    (exercises.length - 1) * SECONDS_BETWEEN_EXERCISES,
  )

  return Math.max(
    ROUNDING_MINUTES,
    Math.round(totalSeconds / 60 / ROUNDING_MINUTES) * ROUNDING_MINUTES,
  )
}
