import { useTranslation } from 'react-i18next'
import './rest-day-banner.scss'

type RestDayBannerProps = {
  dateLabel: string
}

export const RestDayBanner = ({ dateLabel }: RestDayBannerProps) => {
  const { t } = useTranslation('home')

  return (
    <div className="rest-day-banner">
      <span className="rest-day-banner__date">{dateLabel}</span>
      <h1 className="rest-day-banner__title">{t('restDay.title')}</h1>
      <p className="rest-day-banner__meta">{t('restDay.meta')}</p>
    </div>
  )
}
