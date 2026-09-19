import { buildExercisePerformanceIndex } from '@domains/progression/utils/build-exercise-performance-index'
import { useSessions } from '@domains/seances/hooks/use-sessions'
import { useCountdown } from '@shared/hooks/use-countdown'
import { useStopwatch } from '@shared/hooks/use-stopwatch'
import { useActiveSessionState } from './use-active-session-state'
import { useSessionCompletion } from './use-session-completion'
import { useSessionLog } from './use-session-log'
import type { RirValue } from '../types/rir-value'
import type { SetLogEntry } from '../types/set-log-entry'
import { buildLoggedExercises } from '../utils/build-logged-exercises'
import { deriveActiveExercises } from '../utils/derive-active-exercises'
import { DEFAULT_REPS, DEFAULT_WEIGHT, resolveSetPrefill } from '../utils/set-prefill'
import { buildGroups, resolveNextStep } from '../utils/superset-progression'

export const useActiveSession = (sessionId: string | undefined) => {
  const { getSession } = useSessions()
  const session = sessionId ? getSession(sessionId) : undefined

  const exercises = deriveActiveExercises(session?.exercises ?? [])
  const groups = buildGroups(exercises.map((exercise) => exercise.linkedToNext))

  const { sessionLog } = useSessionLog()
  const performanceIndex = buildExercisePerformanceIndex(sessionLog)
  const prefillFor = (exerciseIndex: number) => {
    const exercise = exercises[exerciseIndex]

    return exercise
      ? resolveSetPrefill(performanceIndex, exercise.libraryExerciseId)
      : { weight: DEFAULT_WEIGHT, reps: DEFAULT_REPS }
  }

  const { snapshot, updateSnapshot, clearSnapshot } = useActiveSessionState(
    sessionId,
    exercises.length,
    prefillFor(0),
  )
  const { isSessionComplete, completeSession } = useSessionCompletion()

  const { progress, setLogsByExercise, currentExerciseIndex, reps, weight, selectedRir } = snapshot
  const elapsedSeconds = useStopwatch(snapshot.startedAt, !isSessionComplete)
  const rest = useCountdown()

  const currentExercise = exercises[currentExerciseIndex]
  const completedSetsOfCurrent = progress[currentExerciseIndex] ?? 0
  const currentSetNumber = currentExercise
    ? Math.min(completedSetsOfCurrent + 1, currentExercise.setCount)
    : 1
  const currentGroup = groups.find((group) => group.includes(currentExerciseIndex)) ?? [
    currentExerciseIndex,
  ]

  const finishSession = (finalSetLogsByExercise: SetLogEntry[][]) => {
    if (!session) {
      return
    }

    completeSession({
      name: session.name,
      imageUrl: session.imageUrl,
      startedAt: snapshot.startedAt,
      exercises: buildLoggedExercises(exercises, finalSetLogsByExercise),
    })
    clearSnapshot()
  }

  const advance = (nextCompletedSets: number, logEntry: SetLogEntry | null) => {
    if (!session || !currentExercise) {
      return
    }

    const nextProgress = progress.map((count, index) =>
      index === currentExerciseIndex ? nextCompletedSets : count,
    )
    const nextSetLogs = logEntry
      ? setLogsByExercise.map((log, index) =>
          index === currentExerciseIndex ? [...log, logEntry] : log,
        )
      : setLogsByExercise

    const nextExerciseIndex = resolveNextStep(
      currentGroup,
      currentExerciseIndex,
      nextProgress,
      exercises.map((exercise) => exercise.setCount),
    )

    if (nextExerciseIndex === -1) {
      finishSession(nextSetLogs)
      return
    }

    const nextPrefill = prefillFor(nextExerciseIndex)
    const isSameExercise =
      exercises[nextExerciseIndex].libraryExerciseId === currentExercise.libraryExerciseId

    updateSnapshot({
      progress: nextProgress,
      setLogsByExercise: nextSetLogs,
      currentExerciseIndex: nextExerciseIndex,
      reps: nextPrefill.reps,
      weight: isSameExercise ? weight : nextPrefill.weight,
      selectedRir: null,
    })
  }

  const validateSet = () => {
    if (!currentExercise) {
      return
    }

    const logEntry: SetLogEntry = {
      weight: currentExercise.isBodyweight ? 0 : weight,
      reps,
      rir: selectedRir,
    }
    advance(completedSetsOfCurrent + 1, logEntry)
  }

  const skipSet = () => advance(completedSetsOfCurrent + 1, null)

  const skipExercise = () => advance(currentExercise?.setCount ?? 0, null)

  const selectExercise = (exerciseIndex: number) => {
    const prefill = prefillFor(exerciseIndex)

    updateSnapshot({
      currentExerciseIndex: exerciseIndex,
      reps: prefill.reps,
      weight: prefill.weight,
      selectedRir: null,
    })
  }

  return {
    session,
    exercises: exercises.map((exercise, index) => ({
      ...exercise,
      completedSets: setLogsByExercise[index]?.length ?? 0,
      isActive: index === currentExerciseIndex,
    })),
    currentExercise,
    currentSetNumber,
    supersetSize: currentGroup.length,
    supersetPosition: currentGroup.indexOf(currentExerciseIndex) + 1,
    reps,
    setReps: (value: number) => updateSnapshot({ reps: value }),
    weight,
    setWeight: (value: number) => updateSnapshot({ weight: value }),
    selectedRir,
    selectRir: (value: RirValue | null) => updateSnapshot({ selectedRir: value }),
    isResting: rest.isActive,
    restRemainingSeconds: rest.remainingSeconds,
    restTotalSeconds: rest.isActive ? rest.totalSeconds : (currentExercise?.restSeconds ?? 0),
    startRest: () => rest.start(currentExercise?.restSeconds ?? 0),
    stopRest: rest.stop,
    elapsedSeconds,
    isSessionComplete,
    validateSet,
    skipSet,
    skipExercise,
    selectExercise,
    abandonSession: clearSnapshot,
  }
}
