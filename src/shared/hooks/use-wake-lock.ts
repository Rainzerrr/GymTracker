import { useEffect } from 'react'

// Garde l'écran allumé tant que `isEnabled`. Le verrou saute quand la page passe en arrière-plan :
// on le reprend au retour.
export const useWakeLock = (isEnabled: boolean) => {
  useEffect(() => {
    if (!isEnabled || !('wakeLock' in navigator)) return undefined

    let sentinel: WakeLockSentinel | null = null
    let isCancelled = false

    const acquire = async () => {
      try {
        const acquired = await navigator.wakeLock.request('screen')

        if (isCancelled) {
          void acquired.release()
        } else {
          sentinel = acquired
        }
      } catch {
        // Refusé (économiseur de batterie, page masquée) : on ignore.
      }
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void acquire()
      }
    }

    void acquire()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      isCancelled = true
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      void sentinel?.release()
    }
  }, [isEnabled])
}
