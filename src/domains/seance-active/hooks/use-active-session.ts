import { useState } from 'react'
import { useSessions } from '@domains/seances/hooks/use-sessions'
import { useCountdown } from '@shared/hooks/use-countdown'
import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import { useStopwatch } from '@shared/hooks/use-stopwatch'
import { useSessionLog } from './use-session-log'
import type { RirValue } from '../types/rir-value'
import type { SessionSummary } from '../types/session-summary'
import type { SetLogEntry } from '../types/set-log-entry'
import { buildLoggedExercises } from '../utils/build-logged-exercises'
import { deriveActiveExercises } from '../utils/derive-active-exercises'
import { buildGroups, resolveNextStep } from '../utils/superset-progression'

const DEFAULT_REPS = 8
const DEFAULT_WEIGHT = 20
const createLogId = () => `log-${Date.now()}`

export const useActiveSession = (sessionId: string | undefined) => {
  const { getSession } = useSessions()
  const session = sessionId ? getSession(sessionId) : undefined

  const exercises = deriveActiveExercises(session?.exercises ?? [])
  const groups = buildGroups(exercises.map((exercise) => exercise.linkedToNext))

  const [progress, setProgress] = useState<number[]>(() => exercises.map(() => 0))
  const [setLogsByExercise, setSetLogsByExercise] = useState<SetLogEntry[][]>(() =>
    exercises.map(() => []),
  )
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [reps, setReps] = useState(DEFAULT_REPS)
  const [weight, setWeight] = useState(DEFAULT_WEIGHT)
  const [selectedRir, setSelectedRir] = useState<RirValue | null>(null)
  const [isSessionComplete, setIsSessionComplete] = useState(false)
  const [, setLastSummary] = useLocalStorageState<SessionSummary | null>(
    'seance-active/last-summary',
    null,
  )
  const { logSession } = useSessionLog()

  const elapsedSeconds = useStopwatch(!isSessionComplete)
  const rest = useCountdown()

  const currentExercise = exercises[currentExerciseIndex]
  const currentSetNumber = currentExercise
    ? Math.min((progress[currentExerciseIndex] ?? 0) + 1, currentExercise.setCount)
    : 1
  const currentGroup = groups.find((group) => group.includes(currentExerciseIndex)) ?? [currentExerciseIndex]

  const completeSession = (finalSetLogsByExercise: SetLogEntry[][]) => {
    if (!session) {
      return
    }

    setIsSessionComplete(true)

    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60))
    const completedAt = new Date().toISOString()

    setLastSummary({
      title: session.name,
      imageUrl: session.imageUrl,
      durationMinutes,
      completedAt,
    })

    const loggedExercises = buildLoggedExercises(exercises, finalSetLogsByExercise)

    logSession({
      id: createLogId(),
      sessionName: session.name,
      imageUrl: session.imageUrl,
      durationMinutes,
      completedAt,
      exercises: loggedExercises,
    })
  }

  const advance = (nextCompletedSets: number, logEntry: SetLogEntry | null, allowRest: boolean) => {
    if (!session || !currentExercise) {
      return
    }

    const nextProgress = [...progress]
    nextProgress[currentExerciseIndex] = nextCompletedSets
    setProgress(nextProgress)

    const nextSetLogsByExercise = logEntry
      ? setLogsByExercise.map((log, index) => (index === currentExerciseIndex ? [...log, logEntry] : log))
      : setLogsByExercise

    if (logEntry) {
      setSetLogsByExercise(nextSetLogsByExercise)
    }

    setReps(DEFAULT_REPS)
    setSelectedRir(null)

    const { nextExerciseIndex, shouldRest } = resolveNextStep(
      currentGroup,
      currentExerciseIndex,
      nextProgress,
      exercises.map((exercise) => exercise.setCount),
      allowRest,
    )

    if (nextExerciseIndex === -1) {
      completeSession(nextSetLogsByExercise)
      return
    }

    const nextExercise = exercises[nextExerciseIndex]
    setWeight(nextExercise.libraryExerciseId === currentExercise.libraryExerciseId ? weight : DEFAULT_WEIGHT)

    if (shouldRest) {
      rest.start(currentExercise.restSeconds)
    }

    setCurrentExerciseIndex(nextExerciseIndex)
  }

  const validateSet = () => {
    if (!currentExercise) {
      return
    }

    const logEntry: SetLogEntry = { weight: currentExercise.isBodyweight ? 0 : weight, reps, rir: selectedRir }
    advance((progress[currentExerciseIndex] ?? 0) + 1, logEntry, true)
  }

  const skipSet = () => {
    if (!currentExercise) {
      return
    }

    rest.stop()
    advance((progress[currentExerciseIndex] ?? 0) + 1, null, false)
  }

  const skipExercise = () => {
    if (!currentExercise) {
      return
    }

    rest.stop()
    advance(currentExercise.setCount, null, false)
  }

  return {
    session,
    exercises: exercises.map((exercise, index) => ({
      ...exercise,
      completedSets: progress[index] ?? 0,
      isActive: index === currentExerciseIndex,
    })),
    currentExercise,
    currentSetNumber,
    supersetSize: currentGroup.length,
    supersetPosition: currentGroup.indexOf(currentExerciseIndex) + 1,
    reps,
    setReps,
    weight,
    setWeight,
    selectedRir,
    selectRir: setSelectedRir,
    isResting: rest.isActive,
    restRemainingSeconds: rest.remainingSeconds,
    restTotalSeconds: currentExercise?.restSeconds ?? 0,
    elapsedSeconds,
    isSessionComplete,
    validateSet,
    skipSet,
    skipExercise,
    selectExercise: setCurrentExerciseIndex,
  }
}
