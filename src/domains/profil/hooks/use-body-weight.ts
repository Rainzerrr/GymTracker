import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import { isArray, isFiniteNumber } from '@shared/utils/storage/guards'
import { removeBodyWeightEntry, upsertBodyWeightEntry } from '../utils/body-weight-history'
import type { BodyWeightEntry } from '../utils/body-weight-history'

const STORAGE_KEY = 'profil/body-weight'
const HISTORY_STORAGE_KEY = 'profil/body-weight-history'

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

  const [history, setHistory] = useLocalStorageState<BodyWeightEntry[]>(HISTORY_STORAGE_KEY, [], {
    isValid: isArray<BodyWeightEntry>,
  })

  const recordBodyWeight = () =>
    setHistory(upsertBodyWeightEntry(history, bodyWeightKg, new Date()))
  const removeEntry = (recordedAt: string) => setHistory(removeBodyWeightEntry(history, recordedAt))

  return {
    bodyWeightKg,
    storedBodyWeightKg,
    setBodyWeightKg,
    history,
    recordBodyWeight,
    removeEntry,
  }
}
