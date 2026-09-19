import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import type { ActiveSessionSnapshot } from '../types/active-session-snapshot'
import { isStoredSnapshot } from '../utils/active-session-snapshot'

const STORAGE_KEY = 'seance-active/in-progress'

export const useActiveSessionSnapshot = () =>
  useLocalStorageState<ActiveSessionSnapshot | null>(STORAGE_KEY, null, {
    isValid: isStoredSnapshot,
  })
