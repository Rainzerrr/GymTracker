import { useState } from 'react'
import { useSessions } from '@domains/seances/hooks/use-sessions'
import { parseRestSeconds } from '@domains/seances/utils/parse-rest-seconds'
import { parseSetCount } from '@domains/seances/utils/parse-set-count'
import { useCountdown } from '@shared/hooks/use-countdown'
import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import { useStopwatch } from '@shared/hooks/use-stopwatch'
import type { RirValue } from '../types/rir-value'
import type { SessionSummary } from '../types/session-summary'

const DEFAULT_REPS = 8

export const useActiveSession = (sessionId: string | undefined) => {
  const { getSession } = useSessions()
  const session = sessionId ? getSession(sessionId) : undefined

  const exercises = (session?.exercises ?? []).map((exercise) => ({
    ...exercise,
    setCount: parseSetCount(exercise.targetLabel),
    restSeconds: parseRestSeconds(exercise.restLabel),
  }))

  const [progress, setProgress] = useState<number[]>(() => exercises.map(() => 0))
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [reps, setReps] = useState(DEFAULT_REPS)
  const [selectedRir, setSelectedRir] = useState<RirValue | null>(null)
  const [isSessionComplete, setIsSessionComplete] = useState(false)
  const [, setLastSummary] = useLocalStorageState<SessionSummary | null>('seance-active/last-summary', null)

  const elapsedSeconds = useStopwatch(!isSessionComplete)
  const rest = useCountdown()

  const currentExercise = exercises[currentExerciseIndex]
  const currentSetNumber = currentExercise
    ? Math.min((progress[currentExerciseIndex] ?? 0) + 1, currentExercise.setCount)
    : 1

  const validateSet = () => {
    if (!session || !currentExercise) {
      return
    }

    const nextProgress = [...progress]
    nextProgress[currentExerciseIndex] += 1
    setProgress(nextProgress)
    setReps(DEFAULT_REPS)
    setSelectedRir(null)

    const nextExerciseIndex = nextProgress.findIndex((count, index) => count < exercises[index].setCount)

    if (nextExerciseIndex === -1) {
      setIsSessionComplete(true)
      setLastSummary({
        title: session.name,
        imageUrl: session.imageUrl,
        durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
        completedAt: new Date().toISOString(),
      })
      return
    }

    rest.start(currentExercise.restSeconds)
    setCurrentExerciseIndex(nextExerciseIndex)
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
    selectedRir,
    selectRir: setSelectedRir,
    isResting: rest.isActive,
    restRemainingSeconds: rest.remainingSeconds,
    restTotalSeconds: currentExercise?.restSeconds ?? 0,
    elapsedSeconds,
    isSessionComplete,
    validateSet,
    selectExercise: setCurrentExerciseIndex,
  }
}
