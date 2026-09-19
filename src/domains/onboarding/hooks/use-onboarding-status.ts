import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import { isBoolean } from '@shared/utils/storage/guards'

// Clé sous `reglages/` : elle suit la sauvegarde et l'import, et disparaît avec la remise à zéro.
const STORAGE_KEY = 'reglages/onboarding-seen'

export const useOnboardingStatus = () => {
  const [hasSeen, setHasSeen] = useLocalStorageState<boolean>(STORAGE_KEY, false, {
    isValid: isBoolean,
  })

  return { hasSeen, markSeen: () => setHasSeen(true) }
}
