import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import type { SessionLogEntry } from '../types/session-log-entry'

const STORAGE_KEY = 'seance-active/session-log'

export const useSessionLog = () => {
  const [sessionLog, setSessionLog] = useLocalStorageState<SessionLogEntry[]>(STORAGE_KEY, [])

  const logSession = (entry: SessionLogEntry) => {
    setSessionLog([...sessionLog, entry])
  }

  return { sessionLog, logSession }
}
