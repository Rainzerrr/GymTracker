import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { SectionLabel } from '@shared/atoms/section-label'
import { ConfirmAction } from '@shared/molecules/confirm-action'
import { formatDateLabel } from '@shared/utils/date/format-date-label'
import type { ProfilBackupProps } from './profil-backup.types'
import './profil-backup.scss'

export const ProfilBackup = ({
  importState,
  onExport,
  onFileSelected,
  onCancelImport,
  onConfirmImport,
}: ProfilBackupProps) => {
  const { t } = useTranslation('profil')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    // Vide l'input pour pouvoir re-sélectionner le même fichier après une annulation.
    event.target.value = ''

    if (file) {
      onFileSelected(file)
    }
  }

  return (
    <section className="profil-backup">
      <SectionLabel label={t('backup.label')} />
      <p className="profil-backup__hint">{t('backup.hint')}</p>
      <Button label={t('backup.export')} variant="outline" fullWidth onClick={onExport} />
      <Button
        label={t('backup.import')}
        variant="outline"
        fullWidth
        onClick={() => fileInputRef.current?.click()}
      />
      <input
        ref={fileInputRef}
        className="profil-backup__file"
        type="file"
        accept="application/json,.json"
        onChange={handleFileChange}
        tabIndex={-1}
        aria-hidden="true"
      />
      {importState.status === 'error' && (
        <p className="profil-backup__error" role="alert">
          {t(`backup.errors.${importState.reason}`)}
        </p>
      )}
      {importState.status === 'ready' && (
        <div className="profil-backup__restore">
          <ConfirmAction
            triggerLabel={t('backup.restore')}
            warning={t('backup.restoreWarning', {
              date: importState.backup.exportedAt
                ? formatDateLabel(importState.backup.exportedAt)
                : '—',
              sessions: importState.summary.sessionCount,
              logged: importState.summary.loggedSessionCount,
            })}
            cancelLabel={t('backup.cancel')}
            confirmLabel={t('backup.confirm')}
            onConfirm={onConfirmImport}
          />
          <Button label={t('backup.cancel')} variant="outline" fullWidth onClick={onCancelImport} />
        </div>
      )}
    </section>
  )
}
