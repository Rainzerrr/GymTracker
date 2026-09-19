import { useState } from 'react'
import {
  createBackup,
  parseBackup,
  restoreBackup,
  summarizeBackup,
} from '@shared/utils/storage/backup'
import { toLocalDateKey } from '@shared/utils/date/to-local-date-key'
import type { Backup, BackupSummary } from '@shared/utils/storage/backup'

type ImportState =
  | { status: 'idle' }
  | { status: 'error'; reason: 'invalid' | 'unsupportedVersion' | 'unreadable' }
  | { status: 'ready'; backup: Backup; summary: BackupSummary }

export const useDataBackup = () => {
  const [importState, setImportState] = useState<ImportState>({ status: 'idle' })

  const exportData = () => {
    const now = new Date()
    const blob = new Blob([JSON.stringify(createBackup(window.localStorage, now), null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `gymtracker-${toLocalDateKey(now)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const readFile = async (file: File) => {
    try {
      const parsed = parseBackup(await file.text())

      setImportState(
        parsed.isValid
          ? { status: 'ready', backup: parsed.backup, summary: summarizeBackup(parsed.backup) }
          : { status: 'error', reason: parsed.reason },
      )
    } catch {
      setImportState({ status: 'error', reason: 'unreadable' })
    }
  }

  const cancelImport = () => setImportState({ status: 'idle' })

  const confirmImport = () => {
    if (importState.status !== 'ready') {
      return
    }

    restoreBackup(window.localStorage, importState.backup)
    // Recharge pour que toute l'app relise les données restaurées.
    window.location.href = '/'
  }

  return { importState, exportData, readFile, cancelImport, confirmImport }
}
