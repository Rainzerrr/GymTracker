import { useAppSettings } from '@domains/reglages/hooks/use-app-settings'
import { useCountdown } from '@shared/hooks/use-countdown'
import { useWakeLock } from '@shared/hooks/use-wake-lock'
import { playRestAlert, primeRestAlert } from '@shared/utils/alerts/rest-alert'

// Repos entre deux séries (avec alerte de fin) et écran maintenu allumé pendant la séance.
export const useSessionRest = (restSeconds: number, isSessionActive: boolean) => {
  const { settings } = useAppSettings()
  const rest = useCountdown(settings.restAlert ? playRestAlert : undefined)

  useWakeLock(settings.keepScreenAwake && isSessionActive)

  return {
    isResting: rest.isActive,
    restRemainingSeconds: rest.remainingSeconds,
    restTotalSeconds: rest.isActive ? rest.totalSeconds : restSeconds,
    startRest: () => {
      primeRestAlert()
      rest.start(restSeconds)
    },
    stopRest: rest.stop,
  }
}
