import { useState } from 'react'
import { useActiveSessionSnapshot } from './use-active-session-snapshot'
import type { ActiveSessionSnapshot } from '../types/active-session-snapshot'
import { createSnapshot, isSnapshotResumable } from '../utils/active-session-snapshot'
import type { SetPrefill } from '../utils/set-prefill'

/**
 * État de la séance en cours, persisté. Une séance déjà commencée est reprise telle quelle, sinon
 * on part d'un état neuf, écrit seulement à la première action pour ne pas laisser de séance
 * fantôme après un simple aperçu.
 */
export const useActiveSessionState = (
  sessionId: string | undefined,
  exerciseCount: number,
  initialPrefill: SetPrefill,
) => {
  const [storedSnapshot, setStoredSnapshot] = useActiveSessionSnapshot()
  const [mountedAt] = useState(() => Date.now())
  const [freshSnapshot] = useState(() =>
    createSnapshot(sessionId ?? '', exerciseCount, mountedAt, initialPrefill),
  )

  const canResume = (snapshot: ActiveSessionSnapshot | null) =>
    isSnapshotResumable(snapshot, sessionId, exerciseCount, mountedAt)

  const snapshot = canResume(storedSnapshot) ? storedSnapshot : freshSnapshot

  const updateSnapshot = (patch: Partial<ActiveSessionSnapshot>) => {
    setStoredSnapshot((current) => ({
      ...(canResume(current) ? current : freshSnapshot),
      ...patch,
    }))
  }

  const clearSnapshot = () => setStoredSnapshot(null)

  return { snapshot, updateSnapshot, clearSnapshot }
}
