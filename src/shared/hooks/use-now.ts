import { useEffect, useRef, useState } from 'react'

type UseNowOptions = {
  isTicking: boolean
  intervalMs: number
  // Échéance : l'horloge s'arrête d'elle-même une fois dépassée et `onReachUntil` est appelé une fois.
  until?: number
  onReachUntil?: () => void
}

/**
 * Horloge qui se resynchronise dès que la page redevient visible : les navigateurs ralentissent
 * ou gèlent les timers d'un onglet en arrière-plan (écran verrouillé), donc on ne compte jamais
 * des ticks, on relit `Date.now()`.
 */
export const useNow = ({ isTicking, intervalMs, until, onReachUntil }: UseNowOptions) => {
  const [now, setNow] = useState(() => Date.now())
  const onReachUntilRef = useRef(onReachUntil)

  useEffect(() => {
    onReachUntilRef.current = onReachUntil
  })

  useEffect(() => {
    if (!isTicking) return undefined

    let hasReachedUntil = false

    const refresh = () => {
      const current = Date.now()

      setNow(current)

      if (until === undefined || current < until || hasReachedUntil) {
        return
      }

      hasReachedUntil = true
      clearInterval(intervalId)
      onReachUntilRef.current?.()
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
