import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import defaultSessions from '../data/default-sessions.json'
import type { SessionDraft, WorkoutSession } from '../types/workout-session'
import { DEFAULT_SESSION_IMAGE_URL } from '../utils/default-session-image'

const STORAGE_KEY = 'seances/sessions'

const createId = () => `session-${Date.now()}-${Math.round(Math.random() * 10000)}`

const withImageFallback = (session: WorkoutSession): WorkoutSession => ({
  ...session,
  imageUrl: session.imageUrl || DEFAULT_SESSION_IMAGE_URL,
})

export const useSessions = () => {
  const [sessions, setSessions] = useLocalStorageState<WorkoutSession[]>(
    STORAGE_KEY,
    defaultSessions as WorkoutSession[],
  )

  const resolvedSessions = sessions.map(withImageFallback)

  const getSession = (id: string) => resolvedSessions.find((session) => session.id === id)

  const createSession = (draft: SessionDraft): WorkoutSession => {
    const newSession = withImageFallback({ ...draft, id: createId() })
    setSessions([...sessions, newSession])
    return newSession
  }

  const updateSession = (id: string, draft: SessionDraft) => {
    setSessions(
      sessions.map((session) => (session.id === id ? withImageFallback({ ...draft, id }) : session)),
    )
  }

  const removeSession = (id: string) => {
    setSessions(sessions.filter((session) => session.id !== id))
  }

  return { sessions: resolvedSessions, getSession, createSession, updateSession, removeSession }
}
