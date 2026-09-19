import { useState } from 'react'
import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import { useSessionLog } from './use-session-log'
import type { ExerciseLogEntry } from '../types/exercise-log-entry'
import type { SessionSummary } from '../types/session-summary'

type CompletedSession = {
  name: string
  imageUrl: string
  startedAt: number
  exercises: ExerciseLogEntry[]
}

const MS_PER_MINUTE = 60_000

// Enregistre la séance terminée : historique, résumé pour l'écran de récap, durée réelle.
export const useSessionCompletion = () => {
  const [isSessionComplete, setIsSessionComplete] = useState(false)
  const [, setLastSummary] = useLocalStorageState<SessionSummary | null>(
    'seance-active/last-summary',
    null,
  )
  const { logSession } = useSessionLog()

  const completeSession = ({ name, imageUrl, startedAt, exercises }: CompletedSession) => {
    const completedAt = new Date()
    const durationMinutes = Math.max(
      1,
      Math.round((completedAt.getTime() - startedAt) / MS_PER_MINUTE),
    )
    const completedAtIso = completedAt.toISOString()

    setIsSessionComplete(true)
    setLastSummary({ title: name, imageUrl, durationMinutes, completedAt: completedAtIso })
    logSession({
      id: `log-${completedAt.getTime()}`,
      sessionName: name,
      imageUrl,
      durationMinutes,
      completedAt: completedAtIso,
      exercises,
    })
  }

  return { isSessionComplete, completeSession }
}
