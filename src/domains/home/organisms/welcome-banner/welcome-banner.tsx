import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { HOME_CTA_HEIGHT_REM, HOME_HERO_HEIGHT_REM } from '../../constants/home-hero'
import './welcome-banner.scss'

type WelcomeBannerProps = {
  onInstallStarter: () => void
  onCreateSession: () => void
}

export const WelcomeBanner = ({ onInstallStarter, onCreateSession }: WelcomeBannerProps) => {
  const { t } = useTranslation('home')

  return (
    <div
      className="welcome-banner"
      style={{ minHeight: `${HOME_HERO_HEIGHT_REM + HOME_CTA_HEIGHT_REM}rem` }}
    >
      <div className="welcome-banner__card">
        <h1 className="welcome-banner__title">{t('welcome.title')}</h1>
        <p className="welcome-banner__meta">{t('welcome.meta')}</p>
        <div className="welcome-banner__actions">
          <Button
            label={t('welcome.installStarter')}
            variant="accent"
            fullWidth
            onClick={onInstallStarter}
          />
          <Button
            label={t('welcome.createSession')}
            variant="outline"
            fullWidth
            onClick={onCreateSession}
          />
        </div>
      </div>
    </div>
  )
}
