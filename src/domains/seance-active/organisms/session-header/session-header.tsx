import { useTranslation } from 'react-i18next'
import { useStopwatch } from '@shared/hooks/use-stopwatch'
import { formatDurationClock } from '@shared/utils/date/format-duration-clock'
import type { SessionHeaderProps } from './session-header.types'
import './session-header.scss'

export const SessionHeader = ({ title, startedAt, onBack }: SessionHeaderProps) => {
  const { t } = useTranslation('common')
  // Le chrono tourne ici : seul ce bloc se re-rend chaque seconde.
  const elapsedSeconds = useStopwatch(startedAt, true)

  return (
    <div className="session-header">
      <div className="session-header__left">
        <button
          type="button"
          className="session-header__back"
          onClick={onBack}
          aria-label={t('actions.back')}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="session-header__title">{title}</span>
      </div>
      <span className="session-header__timer">{formatDurationClock(elapsedSeconds)}</span>
    </div>
  )
}
