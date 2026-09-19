import { useTranslation } from 'react-i18next'
import { HOME_CTA_HEIGHT_REM, HOME_HERO_HEIGHT_REM } from '../../constants/home-hero'
import './rest-day-banner.scss'

type RestDayBannerProps = {
  dateLabel: string
  hasPostureRoutine: boolean
}

export const RestDayBanner = ({ dateLabel, hasPostureRoutine }: RestDayBannerProps) => {
  const { t } = useTranslation('home')

  return (
    <div
      className="rest-day-banner"
      style={{ height: `${HOME_HERO_HEIGHT_REM + HOME_CTA_HEIGHT_REM}rem` }}
    >
      <div className="rest-day-banner__card">
        <span className="rest-day-banner__date">{dateLabel}</span>
        <h1 className="rest-day-banner__title">{t('restDay.title')}</h1>
        <p className="rest-day-banner__meta">
          {hasPostureRoutine ? t('restDay.meta') : t('restDay.metaNoRoutine')}
        </p>
      </div>
    </div>
  )
}
