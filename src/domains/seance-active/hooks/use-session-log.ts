import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import { resolveSessionImageUrl } from '@domains/seances/utils/default-session-image'
import type { SessionLogEntry } from '../types/session-log-entry'

const STORAGE_KEY = 'seance-active/session-log'

const createId = () => `log-${Date.now()}`

export const useSessionLog = () => {
  const [storedSessionLog, setSessionLog] = useLocalStorageState<SessionLogEntry[]>(STORAGE_KEY, [])

  // Entries logged before per-focus photos may still point at the retired default image.
  const sessionLog = storedSessionLog.map((entry) => ({
    ...entry,
    imageUrl: resolveSessionImageUrl(entry.imageUrl, entry.exercises),
  }))

  const logSession = (entry: SessionLogEntry) => {
    setSessionLog([...storedSessionLog, entry])
  }

  const getEntryForDate = (date: Date) =>
    sessionLog.find((entry) => new Date(entry.completedAt).toDateString() === date.toDateString())

  const upsertSessionLogForDate = (date: Date, entry: Omit<SessionLogEntry, 'id' | 'completedAt'>) => {
    const existing = getEntryForDate(date)

    if (existing) {
      setSessionLog(
        storedSessionLog.map((log) => (log.id === existing.id ? { ...log, ...entry } : log)),
      )
      return
    }

    setSessionLog([...storedSessionLog, { id: createId(), completedAt: date.toISOString(), ...entry }])
  }

  return { sessionLog, logSession, getEntryForDate, upsertSessionLogForDate }
}
