import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { SectionLabel } from '@shared/atoms/section-label'
import type { ProfilResetDataProps } from './profil-reset-data.types'
import './profil-reset-data.scss'

export const ProfilResetData = ({ onReset }: ProfilResetDataProps) => {
  const { t } = useTranslation('profil')
  const [isConfirming, setIsConfirming] = useState(false)

  return (
    <section>
      <SectionLabel label={t('resetData.label')} />
      {isConfirming ? (
        <div className="profil-reset-data__confirm">
          <p className="profil-reset-data__warning">{t('resetData.warning')}</p>
          <div className="profil-reset-data__actions">
            <Button
              label={t('resetData.cancel')}
              variant="outline"
              fullWidth
              onClick={() => setIsConfirming(false)}
            />
            <Button label={t('resetData.confirm')} variant="danger" fullWidth onClick={onReset} />
          </div>
        </div>
      ) : (
        <Button
          label={t('resetData.trigger')}
          variant="danger"
          fullWidth
          onClick={() => setIsConfirming(true)}
        />
      )}
    </section>
  )
}
