import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import defaultSessions from '../data/default-sessions.json'
import type { SessionDraft, WorkoutSession } from '../types/workout-session'

const STORAGE_KEY = 'seances/sessions'

const createId = () => `session-${Date.now()}-${Math.round(Math.random() * 10000)}`

export const useSessions = () => {
  const [sessions, setSessions] = useLocalStorageState<WorkoutSession[]>(
    STORAGE_KEY,
    defaultSessions as WorkoutSession[],
  )

  const getSession = (id: string) => sessions.find((session) => session.id === id)

  const createSession = (draft: SessionDraft): WorkoutSession => {
    const newSession: WorkoutSession = { ...draft, id: createId() }
    setSessions([...sessions, newSession])
    return newSession
  }

  const updateSession = (id: string, draft: SessionDraft) => {
    setSessions(sessions.map((session) => (session.id === id ? { ...draft, id } : session)))
  }

  const removeSession = (id: string) => {
    setSessions(sessions.filter((session) => session.id !== id))
  }

  return { sessions, getSession, createSession, updateSession, removeSession }
}
