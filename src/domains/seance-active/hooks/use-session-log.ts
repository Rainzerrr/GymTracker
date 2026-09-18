import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import type { SessionLogEntry } from '../types/session-log-entry'

const STORAGE_KEY = 'seance-active/session-log'

const createId = () => `log-${Date.now()}`

export const useSessionLog = () => {
  const [sessionLog, setSessionLog] = useLocalStorageState<SessionLogEntry[]>(STORAGE_KEY, [])

  const logSession = (entry: SessionLogEntry) => {
    setSessionLog([...sessionLog, entry])
  }

  const getEntryForDate = (date: Date) =>
    sessionLog.find((entry) => new Date(entry.completedAt).toDateString() === date.toDateString())

  const upsertSessionLogForDate = (date: Date, entry: Omit<SessionLogEntry, 'id' | 'completedAt'>) => {
    const existing = getEntryForDate(date)

    if (existing) {
      setSessionLog(
        sessionLog.map((log) => (log.id === existing.id ? { ...log, ...entry } : log)),
      )
      return
    }

    setSessionLog([...sessionLog, { id: createId(), completedAt: date.toISOString(), ...entry }])
  }

  return { sessionLog, logSession, getEntryForDate, upsertSessionLogForDate }
}
