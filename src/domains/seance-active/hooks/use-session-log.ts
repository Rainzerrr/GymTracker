import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import { isArray } from '@shared/utils/storage/guards'
import { resolveSessionImageUrl } from '@domains/seances/utils/default-session-image'
import type { SessionLogEntry } from '../types/session-log-entry'

const STORAGE_KEY = 'seance-active/session-log'

const createId = () => `log-${Date.now()}`

// Les entrées enregistrées avant les photos par focus peuvent encore pointer vers l'ancienne image
// par défaut. Le résultat est gardé par référence : tous les écrans partagent le même tableau tant
// que l'historique ne change pas, ce qui évite de recalculer ce qui en dérive (index de
// performances notamment).
const resolvedLogs = new WeakMap<SessionLogEntry[], SessionLogEntry[]>()

const resolveSessionLog = (stored: SessionLogEntry[]): SessionLogEntry[] => {
  const cached = resolvedLogs.get(stored)

  if (cached) {
    return cached
  }

  const resolved = stored.map((entry) => ({
    ...entry,
    imageUrl: resolveSessionImageUrl(entry.imageUrl, entry.exercises),
  }))
  resolvedLogs.set(stored, resolved)

  return resolved
}

export const useSessionLog = () => {
  const [storedSessionLog, setSessionLog] = useLocalStorageState<SessionLogEntry[]>(
    STORAGE_KEY,
    [],
    { isValid: isArray<SessionLogEntry> },
  )

  const sessionLog = resolveSessionLog(storedSessionLog)

  const logSession = (entry: SessionLogEntry) => {
    setSessionLog([...storedSessionLog, entry])
  }

  const removeSessionLogEntry = (id: string) => {
    setSessionLog(storedSessionLog.filter((entry) => entry.id !== id))
  }

  const getEntryForDate = (date: Date) =>
    sessionLog.find((entry) => new Date(entry.completedAt).toDateString() === date.toDateString())

  const upsertSessionLogForDate = (
    date: Date,
    entry: Omit<SessionLogEntry, 'id' | 'completedAt'>,
  ) => {
    const existing = getEntryForDate(date)

    if (existing) {
      setSessionLog(
        storedSessionLog.map((log) => (log.id === existing.id ? { ...log, ...entry } : log)),
      )
      return
    }

    setSessionLog([
      ...storedSessionLog,
      { id: createId(), completedAt: date.toISOString(), ...entry },
    ])
  }

  return { sessionLog, logSession, removeSessionLogEntry, getEntryForDate, upsertSessionLogForDate }
}
