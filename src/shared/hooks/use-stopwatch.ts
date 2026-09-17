import { useEffect, useState } from 'react'

export const useStopwatch = (isRunning: boolean) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    if (!isRunning) return undefined

    const intervalId = setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000)

    return () => clearInterval(intervalId)
  }, [isRunning])

  return elapsedSeconds
}
