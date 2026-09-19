import { useAppSettings } from '@domains/reglages/hooks/use-app-settings'
import { useWakeLock } from '@shared/hooks/use-wake-lock'

// Écran maintenu allumé pendant la séance, si le réglage est activé.
export const useSessionWakeLock = (isSessionActive: boolean) => {
  const { settings } = useAppSettings()

  useWakeLock(settings.keepScreenAwake && isSessionActive)
}
