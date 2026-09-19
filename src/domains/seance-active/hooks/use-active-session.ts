import { useSessions } from '@domains/seances/hooks/use-sessions'
import { useStopwatch } from '@shared/hooks/use-stopwatch'
import { useActiveSessionState } from './use-active-session-state'
import { useSessionCompletion } from './use-session-completion'
import { useSessionRest } from './use-session-rest'
import { useExerciseHistory } from './use-exercise-history'
import type { RirValue } from '../types/rir-value'
import type { SetLogEntry } from '../types/set-log-entry'
import { extractStep, restorePreviousStep } from '../utils/active-session-snapshot'
import { buildLoggedExercises } from '../utils/build-logged-exercises'
import { deriveActiveExercises } from '../utils/derive-active-exercises'
import { buildGroups, resolveNextStep } from '../utils/superset-progression'

export const useActiveSession = (sessionId: string | undefined) => {
  const { getSession } = useSessions()
  const session = sessionId ? getSession(sessionId) : undefined

  const exercises = deriveActiveExercises(session?.exercises ?? [])
  const groups = buildGroups(exercises.map((exercise) => exercise.linkedToNext))

  const { prefillFor, lastPerformanceFor } = useExerciseHistory(exercises)

  const { snapshot, updateSnapshot, clearSnapshot } = useActiveSessionState(
    sessionId,
    exercises.length,
    prefillFor(0),
  )
  const { isSessionComplete, completeSession } = useSessionCompletion()

  const { progress, setLogsByExercise, notesByExercise, currentExerciseIndex } = snapshot
  const { reps, weight, selectedRir } = snapshot
  const elapsedSeconds = useStopwatch(snapshot.startedAt, !isSessionComplete)
  const currentExercise = exercises[currentExerciseIndex]
  const rest = useSessionRest(currentExercise?.restSeconds ?? 0, !isSessionComplete)
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
      exercises: buildLoggedExercises(
        exercises.map((exercise, index) => ({ ...exercise, note: notesByExercise[index] })),
        finalSetLogsByExercise,
      ),
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
      previous: extractStep(snapshot),
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

  const undoLastStep = () => updateSnapshot(restorePreviousStep(snapshot))

  const setNote = (note: string) => {
    updateSnapshot({
      notesByExercise: notesByExercise.map((current, index) =>
        index === currentExerciseIndex ? note : current,
      ),
    })
  }

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
    ...rest,
    elapsedSeconds,
    isSessionComplete,
    validateSet,
    skipSet,
    skipExercise,
    selectExercise,
    lastPerformance: lastPerformanceFor(currentExerciseIndex),
    canUndo: snapshot.previous !== null,
    undoLastStep,
    note: notesByExercise[currentExerciseIndex] ?? '',
    setNote,
    abandonSession: clearSnapshot,
  }
}
