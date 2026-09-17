import { useTranslation } from 'react-i18next'
import type { SupersetLinkButtonProps } from './superset-link-button.types'
import './superset-link-button.scss'

export const SupersetLinkButton = ({ linked, onToggle }: SupersetLinkButtonProps) => {
  const { t } = useTranslation('seances')
  const label = linked ? t('builder.supersetLinked') : t('builder.supersetLink')
  const className = `superset-link-button__btn ${linked ? 'superset-link-button__btn--active' : ''}`

  return (
    <div className="superset-link-button">
      <button type="button" className={className} onClick={onToggle}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path d="M9 15l6-6M10 6l1.5-1.5a3.5 3.5 0 015 5L15 11M14 18l-1.5 1.5a3.5 3.5 0 01-5-5L9 13" />
        </svg>
        {label}
      </button>
    </div>
  )
}
