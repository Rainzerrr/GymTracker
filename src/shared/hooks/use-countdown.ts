import { useState } from 'react'
import { useNow } from './use-now'

const TICK_MS = 250

export const computeRemainingSeconds = (endsAt: number, now: number, totalSeconds: number) =>
  Math.min(totalSeconds, Math.max(0, Math.ceil((endsAt - now) / 1000)))

export const useCountdown = (onComplete?: () => void) => {
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const now = useNow({
    isTicking: endsAt !== null,
    intervalMs: TICK_MS,
    until: endsAt ?? undefined,
    onReachUntil: onComplete,
  })

  const remainingSeconds = endsAt === null ? 0 : computeRemainingSeconds(endsAt, now, totalSeconds)
  const isActive = remainingSeconds > 0

  const start = (seconds: number) => {
    setTotalSeconds(seconds)
    setEndsAt(Date.now() + seconds * 1000)
  }

  const stop = () => {
    setEndsAt(null)
  }

  return { remainingSeconds, totalSeconds, isActive, start, stop }
}
