import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import defaultSessions from '../data/default-sessions.json'
import type { SessionDraft, WorkoutSession } from '../types/workout-session'
import { resolveSessionImageUrl } from '../utils/default-session-image'

const STORAGE_KEY = 'seances/sessions'

const createId = () => `session-${Date.now()}-${Math.round(Math.random() * 10000)}`

// Sessions keep an empty imageUrl until one is chosen explicitly, so the
// default photo follows the session's focus as its exercises change.
const withResolvedImage = (session: WorkoutSession): WorkoutSession => ({
  ...session,
  imageUrl: resolveSessionImageUrl(session.imageUrl, session.exercises),
})

export const useSessions = () => {
  const [sessions, setSessions] = useLocalStorageState<WorkoutSession[]>(
    STORAGE_KEY,
    defaultSessions as WorkoutSession[],
  )

  const resolvedSessions = sessions.map(withResolvedImage)

  const getSession = (id: string) => resolvedSessions.find((session) => session.id === id)

  const createSession = (draft: SessionDraft): WorkoutSession => {
    const newSession: WorkoutSession = { ...draft, id: createId() }
    setSessions([...sessions, newSession])
    return withResolvedImage(newSession)
  }

  const updateSession = (id: string, draft: SessionDraft) => {
    setSessions(
      sessions.map((session) => {
        if (session.id !== id) {
          return session
        }

        // The draft carries the resolved image; only keep it when it was chosen explicitly.
        const isAutoImage = draft.imageUrl === resolveSessionImageUrl(session.imageUrl, session.exercises)

        return { ...draft, id, imageUrl: isAutoImage ? session.imageUrl : draft.imageUrl }
      }),
    )
  }

  const removeSession = (id: string) => {
    setSessions(sessions.filter((session) => session.id !== id))
  }

  return { sessions: resolvedSessions, getSession, createSession, updateSession, removeSession }
}
