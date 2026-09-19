import { useTranslation } from 'react-i18next'
import { SectionLabel } from '@shared/atoms/section-label'
import { ConfirmAction } from '@shared/molecules/confirm-action'
import type { ProfilResetDataProps } from './profil-reset-data.types'

export const ProfilResetData = ({ onReset }: ProfilResetDataProps) => {
  const { t } = useTranslation('profil')

  return (
    <section>
      <SectionLabel label={t('resetData.label')} />
      <ConfirmAction
        triggerLabel={t('resetData.trigger')}
        warning={t('resetData.warning')}
        cancelLabel={t('resetData.cancel')}
        confirmLabel={t('resetData.confirm')}
        onConfirm={onReset}
      />
    </section>
  )
}
