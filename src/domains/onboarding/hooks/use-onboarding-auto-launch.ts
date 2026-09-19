import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSessionLog } from '@domains/seance-active/hooks/use-session-log'
import { useSessions } from '@domains/seances/hooks/use-sessions'
import { SPLASH_FINISH_DELAY_MS } from '@shared/constants/splash'
import { useOnboardingStatus } from './use-onboarding-status'

/**
 * Ouvre l'onboarding au tout premier lancement, une fois le splash terminé. Un utilisateur qui a
 * déjà des séances ou un historique (mise à jour de l'app, import) ne le voit pas de lui-même :
 * il le retrouve dans son profil.
 */
export const useOnboardingAutoLaunch = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { hasSeen } = useOnboardingStatus()
  const { sessions } = useSessions()
  const { sessionLog } = useSessionLog()

  const isFreshInstall = sessions.length === 0 && sessionLog.length === 0
  const shouldLaunch = !hasSeen && isFreshInstall && pathname === '/'

  useEffect(() => {
    if (!shouldLaunch) {
      return undefined
    }

    const timer = setTimeout(
      () => navigate('/onboarding', { replace: true }),
      SPLASH_FINISH_DELAY_MS,
    )

    return () => clearTimeout(timer)
  }, [shouldLaunch, navigate])
}
