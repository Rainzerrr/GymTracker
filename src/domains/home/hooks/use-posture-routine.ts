import { useTranslation } from 'react-i18next'
import { useAppSettings } from '@domains/reglages/hooks/use-app-settings'
import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'

const STEPS_STORAGE_KEY = 'reglages/posture-steps'
const VALIDATED_STORAGE_KEY = 'home/posture-validated-on'

const isStoredSteps = (value: unknown): value is string[] | null =>
  value === null || (Array.isArray(value) && value.every((step) => typeof step === 'string'))

// Routine quotidienne : étapes personnalisables (par défaut celles des traductions), validée une
// fois par jour. La date de validation est une valeur unique, pas une clé par jour.
export const usePostureRoutine = (todayKey: string) => {
  const { t } = useTranslation('home')
  const { settings } = useAppSettings()
  const [storedSteps, setStoredSteps] = useLocalStorageState<string[] | null>(
    STEPS_STORAGE_KEY,
    null,
    { isValid: isStoredSteps },
  )
  const [validatedOn, setValidatedOn] = useLocalStorageState(VALIDATED_STORAGE_KEY, '')

  const defaultSteps = t('postureRoutine.defaultSteps', { returnObjects: true }) as string[]

  return {
    isEnabled: settings.postureRoutineEnabled,
    steps: storedSteps ?? defaultSteps,
    setSteps: setStoredSteps,
    resetSteps: () => setStoredSteps(null),
    isValidatedToday: validatedOn === todayKey,
    validateToday: () => setValidatedOn(todayKey),
  }
}
