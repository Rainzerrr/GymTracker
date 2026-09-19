import { useEffect, useState } from 'react'

/**
 * Horloge qui se resynchronise dès que la page redevient visible : les navigateurs ralentissent
 * ou gèlent les timers d'un onglet en arrière-plan (écran verrouillé), donc on ne compte jamais
 * des ticks, on relit `Date.now()`. Avec `until`, l'horloge s'arrête d'elle-même à cette échéance.
 */
export const useNow = (isTicking: boolean, intervalMs: number, until?: number) => {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!isTicking) return undefined

    const refresh = () => {
      const current = Date.now()

      setNow(current)

      if (until !== undefined && current >= until) {
        clearInterval(intervalId)
      }
    }

    const intervalId = setInterval(refresh, intervalMs)

    refresh()
    document.addEventListener('visibilitychange', refresh)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [isTicking, intervalMs, until])

  return now
}
