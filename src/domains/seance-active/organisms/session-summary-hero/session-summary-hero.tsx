import { useTranslation } from 'react-i18next'
import { PhotoHero } from '@shared/organisms/photo-hero'
import type { SessionSummaryHeroProps } from './session-summary-hero.types'
import './session-summary-hero.scss'

export const SessionSummaryHero = ({
  title,
  imageUrl,
  metaLabel,
  onClose,
}: SessionSummaryHeroProps) => {
  const { t } = useTranslation('seanceActive')
  const { t: tCommon } = useTranslation('common')

  return (
    <PhotoHero
      imageUrl={imageUrl}
      alt={title}
      title={title}
      meta={metaLabel}
      heightRem={14.375}
      topLeft={
        <span className="session-summary-hero__badge">
          <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path
              d="M12 25 L20 33 L37 14"
              stroke="currentColor"
              strokeWidth={4.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t('recap.badge')}
        </span>
      }
      topRight={
        <button
          type="button"
          className="session-summary-hero__close"
          onClick={onClose}
          aria-label={tCommon('actions.close')}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      }
    />
  )
}
