import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import type { AbandonSessionProps } from './abandon-session.types'
import './abandon-session.scss'

export const AbandonSession = ({ onAbandon }: AbandonSessionProps) => {
  const { t } = useTranslation('seanceActive')
  const [isConfirming, setIsConfirming] = useState(false)

  if (!isConfirming) {
    return (
      <Button
        label={t('abandon.trigger')}
        variant="outline"
        fullWidth
        onClick={() => setIsConfirming(true)}
      />
    )
  }

  return (
    <div className="abandon-session__confirm">
      <p className="abandon-session__warning">{t('abandon.warning')}</p>
      <div className="abandon-session__actions">
        <Button
          label={t('abandon.cancel')}
          variant="outline"
          fullWidth
          onClick={() => setIsConfirming(false)}
        />
        <Button label={t('abandon.confirm')} variant="danger" fullWidth onClick={onAbandon} />
      </div>
    </div>
  )
}
