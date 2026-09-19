import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import { isFiniteNumber } from '@shared/utils/storage/guards'

const STORAGE_KEY = 'profil/body-weight'

export const DEFAULT_BODY_WEIGHT_KG = 80
const MIN_BODY_WEIGHT_KG = 40
const MAX_BODY_WEIGHT_KG = 160

export const useBodyWeight = () => {
  const [storedBodyWeightKg, setBodyWeightKg] = useLocalStorageState<number>(
    STORAGE_KEY,
    DEFAULT_BODY_WEIGHT_KG,
    { isValid: isFiniteNumber },
  )

  // La valeur brute peut être vide ou aberrante pendant la saisie : on borne à la lecture.
  const bodyWeightKg = Math.min(
    MAX_BODY_WEIGHT_KG,
    Math.max(MIN_BODY_WEIGHT_KG, storedBodyWeightKg || DEFAULT_BODY_WEIGHT_KG),
  )

  return { bodyWeightKg, storedBodyWeightKg, setBodyWeightKg }
}
