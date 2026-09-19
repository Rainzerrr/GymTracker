import { useSessionLog } from '@domains/seance-active/hooks/use-session-log'
import { deriveActiveExercises } from '@domains/seance-active/utils/derive-active-exercises'
import { findLastSets, resolveNextTarget } from '@domains/seance-active/utils/set-prefill'
import { buildExercisePerformanceIndex } from '@domains/progression/utils/build-exercise-performance-index'
import { useSessions } from '@domains/seances/hooks/use-sessions'
import { estimateSessionMinutes } from '@domains/seances/utils/estimate-session-duration'
import type { MuscleGroup } from '@domains/seances/types/muscle-group'

// Aperçu d'une séance à venir : ce qu'elle contient, ce qu'on a fait la dernière fois sur chaque
// exercice, l'objectif proposé cette fois et une durée réaliste.
export const useSessionPreview = (sessionId: string | undefined) => {
  const { getSession } = useSessions()
  const { sessionLog } = useSessionLog()
  const session = sessionId ? getSession(sessionId) : undefined

  if (!session) {
    return undefined
  }

  const performanceIndex = buildExercisePerformanceIndex(sessionLog)
  const derivedExercises = deriveActiveExercises(session.exercises)

  const exercises = derivedExercises.map((exercise) => ({
    id: exercise.id,
    name: exercise.name,
    thumbnailUrl: exercise.thumbnailUrl,
    targetLabel: exercise.targetLabel,
    restLabel: exercise.restLabel,
    isBodyweight: exercise.isBodyweight,
    lastSets: findLastSets(performanceIndex, exercise.libraryExerciseId),
    nextTarget: resolveNextTarget(performanceIndex, exercise),
  }))

  const muscleGroups = derivedExercises.reduce<MuscleGroup[]>(
    (groups, { muscleGroup }) =>
      muscleGroup && !groups.includes(muscleGroup) ? [...groups, muscleGroup] : groups,
    [],
  )

  const lastEntry = sessionLog
    .filter((entry) => entry.sessionName === session.name)
    .reduce<(typeof sessionLog)[number] | undefined>(
      (latest, entry) => (!latest || entry.completedAt > latest.completedAt ? entry : latest),
      undefined,
    )

  // La durée réelle de la dernière fois vaut mieux qu'une estimation.
  const durationMinutes = lastEntry?.durationMinutes || estimateSessionMinutes(derivedExercises)

  return {
    title: session.name,
    exercises,
    muscleGroups,
    durationMinutes,
    lastDoneAt: lastEntry?.completedAt,
  }
}
