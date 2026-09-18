import { useState } from 'react'
import { getLibraryExercise } from '@domains/seances/hooks/use-exercise-library'
import { useSessions } from '@domains/seances/hooks/use-sessions'
import { isBodyweightEquipment } from '@domains/seances/utils/is-bodyweight-equipment'
import { parseRestSeconds } from '@domains/seances/utils/parse-rest-seconds'
import { parseSetCount } from '@domains/seances/utils/parse-set-count'
import { useCountdown } from '@shared/hooks/use-countdown'
import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import { useStopwatch } from '@shared/hooks/use-stopwatch'
import { useSessionLog } from './use-session-log'
import type { RirValue } from '../types/rir-value'
import type { SessionSummary } from '../types/session-summary'
import type { SetLogEntry } from '../types/set-log-entry'
import { buildLoggedExercises } from '../utils/build-logged-exercises'

const DEFAULT_REPS = 8
const DEFAULT_WEIGHT = 20

export const useActiveSession = (sessionId: string | undefined) => {
  const { getSession } = useSessions()
  const session = sessionId ? getSession(sessionId) : undefined

  const exercises = (session?.exercises ?? []).map((exercise) => {
    const libraryExercise = getLibraryExercise(exercise.libraryExerciseId)

    return {
      ...exercise,
      setCount: parseSetCount(exercise.targetLabel),
      restSeconds: parseRestSeconds(exercise.restLabel),
      muscleGroup: libraryExercise?.muscleGroup,
      isBodyweight: libraryExercise ? isBodyweightEquipment(libraryExercise.equipment) : false,
    }
  })

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
      id: `log-${Date.now()}`,
      sessionName: session.name,
      imageUrl: session.imageUrl,
      durationMinutes,
      completedAt,
      exercises: loggedExercises,
    })
  }

  const advance = (nextCompletedSets: number, logEntry: SetLogEntry | null, startRest: boolean) => {
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

    const nextExerciseIndex = nextProgress.findIndex(
      (count, index) => count < exercises[index].setCount,
    )

    if (nextExerciseIndex === -1) {
      completeSession(nextSetLogsByExercise)
      return
    }

    const nextExercise = exercises[nextExerciseIndex]
    setWeight(
      nextExercise.libraryExerciseId === currentExercise.libraryExerciseId
        ? weight
        : DEFAULT_WEIGHT,
    )

    if (startRest) {
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

    advance((progress[currentExerciseIndex] ?? 0) + 1, null, false)
  }

  const skipExercise = () => {
    if (!currentExercise) {
      return
    }

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
