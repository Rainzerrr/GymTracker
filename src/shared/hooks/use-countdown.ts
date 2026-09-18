import { useEffect, useState } from 'react'

export const useCountdown = () => {
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const isActive = hasStarted && remainingSeconds > 0

  useEffect(() => {
    if (!isActive) return undefined

    const timeoutId = setTimeout(() => setRemainingSeconds((seconds) => seconds - 1), 1000)

    return () => clearTimeout(timeoutId)
  }, [isActive, remainingSeconds])

  const start = (seconds: number) => {
    setRemainingSeconds(seconds)
    setTotalSeconds(seconds)
    setHasStarted(true)
  }

  const stop = () => {
    setRemainingSeconds(0)
  }

  return { remainingSeconds, totalSeconds, isActive, start, stop }
}
