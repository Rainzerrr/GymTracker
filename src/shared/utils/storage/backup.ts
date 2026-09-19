export const BACKUP_FORMAT = 'gymtracker-backup'
export const BACKUP_VERSION = 1

// Seules les données de l'app sont sauvegardées. La séance en cours est transitoire : la restaurer
// sur un autre appareil n'aurait pas de sens.
const BACKED_UP_PREFIXES = ['seances/', 'seance-active/', 'profil/', 'home/', 'reglages/']
const EXCLUDED_KEYS = ['seance-active/in-progress']

export type Backup = {
  format: typeof BACKUP_FORMAT
  version: number
  exportedAt: string
  // Valeurs brutes (JSON sérialisé) par clé de stockage
  data: Record<string, string>
}

export type BackupSummary = {
  sessionCount: number
  loggedSessionCount: number
}

export type ParsedBackup =
  { isValid: true; backup: Backup } | { isValid: false; reason: 'invalid' | 'unsupportedVersion' }

type ReadableStorage = Pick<Storage, 'length' | 'key' | 'getItem'>
type WritableStorage = ReadableStorage & Pick<Storage, 'setItem' | 'removeItem'>

export const isBackedUpKey = (key: string) =>
  BACKED_UP_PREFIXES.some((prefix) => key.startsWith(prefix)) && !EXCLUDED_KEYS.includes(key)

const listBackedUpKeys = (storage: ReadableStorage): string[] =>
  Array.from({ length: storage.length }, (_unused, index) => storage.key(index)).filter(
    (key): key is string => key !== null && isBackedUpKey(key),
  )

export const createBackup = (storage: ReadableStorage, now: Date = new Date()): Backup => ({
  format: BACKUP_FORMAT,
  version: BACKUP_VERSION,
  exportedAt: now.toISOString(),
  data: Object.fromEntries(
    listBackedUpKeys(storage).map((key) => [key, storage.getItem(key) ?? 'null']),
  ),
})

const isParsableJson = (raw: string) => {
  try {
    JSON.parse(raw)

    return true
  } catch {
    return false
  }
}

export const parseBackup = (text: string): ParsedBackup => {
  let parsed: unknown

  try {
    parsed = JSON.parse(text)
  } catch {
    return { isValid: false, reason: 'invalid' }
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { isValid: false, reason: 'invalid' }
  }

  const candidate = parsed as Partial<Backup>

  if (candidate.format !== BACKUP_FORMAT || typeof candidate.data !== 'object' || !candidate.data) {
    return { isValid: false, reason: 'invalid' }
  }

  if (typeof candidate.version !== 'number' || candidate.version > BACKUP_VERSION) {
    return { isValid: false, reason: 'unsupportedVersion' }
  }

  const entries = Object.entries(candidate.data)
  const areEntriesSafe = entries.every(
    ([key, raw]) => isBackedUpKey(key) && typeof raw === 'string' && isParsableJson(raw),
  )

  if (!areEntriesSafe) {
    return { isValid: false, reason: 'invalid' }
  }

  return {
    isValid: true,
    backup: {
      format: BACKUP_FORMAT,
      version: candidate.version,
      exportedAt: typeof candidate.exportedAt === 'string' ? candidate.exportedAt : '',
      data: Object.fromEntries(entries) as Record<string, string>,
    },
  }
}

const countListItems = (raw: string | undefined) => {
  try {
    const value: unknown = raw === undefined ? [] : JSON.parse(raw)

    return Array.isArray(value) ? value.length : 0
  } catch {
    return 0
  }
}

export const summarizeBackup = (backup: Backup): BackupSummary => ({
  sessionCount: countListItems(backup.data['seances/sessions']),
  loggedSessionCount: countListItems(backup.data['seance-active/session-log']),
})

// Remplace les données de l'app par celles de la sauvegarde (les clés absentes de la sauvegarde
// sont supprimées, pour ne pas mélanger deux historiques).
export const restoreBackup = (storage: WritableStorage, backup: Backup) => {
  listBackedUpKeys(storage).forEach((key) => storage.removeItem(key))
  Object.entries(backup.data).forEach(([key, raw]) => storage.setItem(key, raw))
}
