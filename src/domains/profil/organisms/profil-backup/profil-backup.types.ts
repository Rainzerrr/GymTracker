import type { Backup, BackupSummary } from '@shared/utils/storage/backup'

export type ProfilBackupImportState =
  | { status: 'idle' }
  | { status: 'error'; reason: 'invalid' | 'unsupportedVersion' | 'unreadable' }
  | { status: 'ready'; backup: Backup; summary: BackupSummary }

export type ProfilBackupProps = {
  importState: ProfilBackupImportState
  onExport: () => void
  onFileSelected: (file: File) => void
  onCancelImport: () => void
  onConfirmImport: () => void
}
