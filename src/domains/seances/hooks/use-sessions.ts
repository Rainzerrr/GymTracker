import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import { isArray } from '@shared/utils/storage/guards'
import defaultSessions from '../data/default-sessions.json'
import type { SessionDraft, WorkoutSession } from '../types/workout-session'
import { resolveSessionImageUrl } from '../utils/default-session-image'

const STORAGE_KEY = 'seances/sessions'

const createId = (offset = 0) =>
  `session-${Date.now()}-${offset}-${Math.round(Math.random() * 10000)}`
const createExerciseId = () => `exercise-${Date.now()}-${Math.round(Math.random() * 100000)}`

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
    { isValid: isArray<WorkoutSession> },
  )

  const resolvedSessions = sessions.map(withResolvedImage)

  const getSession = (id: string) => resolvedSessions.find((session) => session.id === id)

  const createSession = (draft: SessionDraft): WorkoutSession => {
    const newSession: WorkoutSession = { ...draft, id: createId() }
    setSessions([...sessions, newSession])
    return withResolvedImage(newSession)
  }

  const createSessions = (drafts: SessionDraft[]): WorkoutSession[] => {
    const created = drafts.map((draft, index) => ({ ...draft, id: createId(index) }))
    setSessions([...sessions, ...created])
    return created
  }

  const duplicateSession = (id: string, name: string) => {
    const source = sessions.find((session) => session.id === id)

    if (!source) {
      return
    }

    setSessions([
      ...sessions,
      {
        ...source,
        id: createId(),
        name,
        exercises: source.exercises.map((exercise) => ({ ...exercise, id: createExerciseId() })),
      },
    ])
  }

  const updateSession = (id: string, draft: SessionDraft) => {
    setSessions(
      sessions.map((session) => {
        if (session.id !== id) {
          return session
        }

        // The draft carries the resolved image; only keep it when it was chosen explicitly.
        const isAutoImage =
          draft.imageUrl === resolveSessionImageUrl(session.imageUrl, session.exercises)

        return { ...draft, id, imageUrl: isAutoImage ? session.imageUrl : draft.imageUrl }
      }),
    )
  }

  const removeSession = (id: string) => {
    setSessions(sessions.filter((session) => session.id !== id))
  }

  return {
    sessions: resolvedSessions,
    getSession,
    createSession,
    createSessions,
    duplicateSession,
    updateSession,
    removeSession,
  }
}
