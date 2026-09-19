import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'
import { readStoredValue } from '@shared/utils/storage/local-storage-store'
import { isRecord } from '@shared/utils/storage/guards'
import { DEFAULT_APP_SETTINGS } from '../data/default-settings'
import type { AppSettings } from '../types/app-settings'

const STORAGE_KEY = 'reglages/settings'

type StoredSettings = Partial<AppSettings>

// Lecture hors React (au démarrage, avant le premier rendu).
export const readAppSettings = (): AppSettings => ({
  ...DEFAULT_APP_SETTINGS,
  ...readStoredValue<StoredSettings>(STORAGE_KEY, {}, isRecord<StoredSettings>),
})

export const useAppSettings = () => {
  const [stored, setStored] = useLocalStorageState<StoredSettings>(
    STORAGE_KEY,
    {},
    {
      isValid: isRecord<StoredSettings>,
    },
  )

  // Un réglage absent (ajouté après coup) retombe sur sa valeur par défaut.
  const settings: AppSettings = { ...DEFAULT_APP_SETTINGS, ...stored }

  const updateSettings = (patch: StoredSettings) => {
    setStored((current) => ({ ...current, ...patch }))
  }

  return { settings, updateSettings }
}
