import { useTranslation } from 'react-i18next'
import type { BackHeaderProps } from './back-header.types'
import './back-header.scss'

export const BackHeader = ({ title, onBack }: BackHeaderProps) => {
  const { t } = useTranslation('common')

  return (
    <div className="back-header">
      <button type="button" className="back-header__back" onClick={onBack} aria-label={t('actions.back')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <span className="back-header__title">{title}</span>
    </div>
  )
}
