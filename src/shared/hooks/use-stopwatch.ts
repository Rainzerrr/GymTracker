import { useNow } from './use-now'

const TICK_MS = 1000

export const computeElapsedSeconds = (startedAt: number, now: number): number =>
  Math.max(0, Math.floor((now - startedAt) / 1000))

export const useStopwatch = (startedAt: number, isRunning: boolean) => {
  const now = useNow({ isTicking: isRunning, intervalMs: TICK_MS })

  return computeElapsedSeconds(startedAt, now)
}
