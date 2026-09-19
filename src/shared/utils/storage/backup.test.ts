import { describe, expect, it } from 'vitest'
import {
  BACKUP_FORMAT,
  BACKUP_VERSION,
  createBackup,
  isBackedUpKey,
  parseBackup,
  restoreBackup,
  summarizeBackup,
} from './backup'

const createStorage = (initial: Record<string, string> = {}) => {
  const data = new Map(Object.entries(initial))

  return {
    get length() {
      return data.size
    },
    key: (index: number) => [...data.keys()][index] ?? null,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value)
    },
    removeItem: (key: string) => {
      data.delete(key)
    },
    snapshot: () => Object.fromEntries(data),
  }
}

describe('isBackedUpKey', () => {
  it('garde les données de l’app et écarte le reste', () => {
    expect(isBackedUpKey('seances/sessions')).toBe(true)
    expect(isBackedUpKey('reglages/settings')).toBe(true)
    expect(isBackedUpKey('demo-backup/seances/sessions')).toBe(false)
    expect(isBackedUpKey('autre-app/token')).toBe(false)
  })

  it('exclut la séance en cours', () => {
    expect(isBackedUpKey('seance-active/in-progress')).toBe(false)
  })
})

describe('createBackup / parseBackup', () => {
  it('fait un aller-retour sans perte', () => {
    const storage = createStorage({
      'seances/sessions': '[{"id":"a"}]',
      'profil/body-weight': '82',
      'seance-active/in-progress': '{"x":1}',
      'autre-app/token': '"secret"',
    })
    const backup = createBackup(storage, new Date('2026-09-19T10:00:00Z'))
    const parsed = parseBackup(JSON.stringify(backup))

    expect(backup.data).toEqual({ 'seances/sessions': '[{"id":"a"}]', 'profil/body-weight': '82' })
    expect(parsed).toEqual({ isValid: true, backup })
  })

  it('rejette un fichier qui n’est pas du JSON', () => {
    expect(parseBackup('pas du json')).toEqual({ isValid: false, reason: 'invalid' })
  })

  it('rejette un JSON qui n’est pas une sauvegarde', () => {
    expect(parseBackup('{"hello":1}')).toEqual({ isValid: false, reason: 'invalid' })
    expect(parseBackup('null')).toEqual({ isValid: false, reason: 'invalid' })
  })

  it('rejette une sauvegarde issue d’une version plus récente', () => {
    const text = JSON.stringify({ format: BACKUP_FORMAT, version: BACKUP_VERSION + 1, data: {} })

    expect(parseBackup(text)).toEqual({ isValid: false, reason: 'unsupportedVersion' })
  })

  it('rejette une clé étrangère à l’app ou une valeur illisible', () => {
    const foreignKey = { format: BACKUP_FORMAT, version: 1, data: { 'autre-app/token': '1' } }
    const brokenValue = { format: BACKUP_FORMAT, version: 1, data: { 'seances/sessions': '{oups' } }

    expect(parseBackup(JSON.stringify(foreignKey))).toEqual({ isValid: false, reason: 'invalid' })
    expect(parseBackup(JSON.stringify(brokenValue))).toEqual({ isValid: false, reason: 'invalid' })
  })
})

describe('restoreBackup', () => {
  it('remplace les données de l’app sans toucher au reste', () => {
    const storage = createStorage({
      'seances/sessions': '[{"id":"old"}]',
      'profil/display-name': '"Ancien"',
      'seance-active/in-progress': '{"x":1}',
      'autre-app/token': '"secret"',
    })
    const backup = createBackup(createStorage({ 'seances/sessions': '[{"id":"new"}]' }))

    restoreBackup(storage, backup)

    expect(storage.snapshot()).toEqual({
      'seances/sessions': '[{"id":"new"}]',
      'seance-active/in-progress': '{"x":1}',
      'autre-app/token': '"secret"',
    })
  })
})

describe('summarizeBackup', () => {
  it('compte les séances et l’historique', () => {
    const backup = createBackup(
      createStorage({
        'seances/sessions': '[{},{}]',
        'seance-active/session-log': '[{},{},{}]',
      }),
    )

    expect(summarizeBackup(backup)).toEqual({ sessionCount: 2, loggedSessionCount: 3 })
  })
})
