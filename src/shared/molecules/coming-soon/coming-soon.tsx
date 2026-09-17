import { useTranslation } from 'react-i18next'
import './coming-soon.scss'

export const ComingSoon = () => {
  const { t } = useTranslation('common')

  return (
    <div className="coming-soon">
      <p className="coming-soon__text">{t('comingSoon.message')}</p>
    </div>
  )
}
