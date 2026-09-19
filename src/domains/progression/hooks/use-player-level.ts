import { useSessionLog } from '@domains/seance-active/hooks/use-session-log'
import { computeLevel } from '../utils/compute-level'
import { computeSessionXp } from '../utils/compute-session-xp'

export const usePlayerLevel = () => {
  const { sessionLog } = useSessionLog()
  const lifetimeXp = sessionLog.reduce(
    (total, session) => total + computeSessionXp(session.exercises),
    0,
  )

  return computeLevel(lifetimeXp)
}
