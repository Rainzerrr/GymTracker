import { useLocalStorageState } from '@shared/hooks/use-local-storage-state'

const NAME_STORAGE_KEY = 'profil/display-name'
const FIRST_SEEN_STORAGE_KEY = 'profil/first-seen'

export const useProfilIdentity = () => {
  const [displayName, setDisplayName] = useLocalStorageState(NAME_STORAGE_KEY, '')
  const [firstSeenAt] = useLocalStorageState(FIRST_SEEN_STORAGE_KEY, new Date().toISOString())

  return {
    displayName,
    setDisplayName,
    memberSinceIso: firstSeenAt,
  }
}
