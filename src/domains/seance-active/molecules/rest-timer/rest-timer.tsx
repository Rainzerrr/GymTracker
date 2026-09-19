import { useTranslation } from 'react-i18next'
import { useAppSettings } from '@domains/reglages/hooks/use-app-settings'
import { useCountdown } from '@shared/hooks/use-countdown'
import { formatDurationClock } from '@shared/utils/date/format-duration-clock'
import { playRestAlert, primeRestAlert } from '@shared/utils/alerts/rest-alert'
import type { RestTimerProps } from './rest-timer.types'
import './rest-timer.scss'

// Le décompte vit ici (et pas dans la page) : il se met à jour 4 fois par seconde et ne doit
// re-rendre que ce bloc, pas toute la séance.
export const RestTimer = ({ restSeconds }: RestTimerProps) => {
  const { t } = useTranslation('seanceActive')
  const { settings } = useAppSettings()
  const rest = useCountdown(settings.restAlert ? playRestAlert : undefined)

  const totalSeconds = rest.isActive ? rest.totalSeconds : restSeconds
  const progressPercent = rest.isActive
    ? ((totalSeconds - rest.remainingSeconds) / totalSeconds) * 100
    : 0

  const handleToggle = () => {
    if (rest.isActive) {
      rest.stop()
      return
    }

    primeRestAlert()
    rest.start(restSeconds)
  }

  return (
    <div className="rest-timer">
      <div className="rest-timer__row">
        <span>{t('rest')}</span>
        <span>
          {rest.isActive
            ? t('restRemaining', { time: formatDurationClock(rest.remainingSeconds) })
            : formatDurationClock(totalSeconds)}
        </span>
        <button type="button" className="rest-timer__toggle" onClick={handleToggle}>
          {rest.isActive ? t('restStop') : t('restStart')}
        </button>
      </div>
      <div className="rest-timer__bar">
        <div className="rest-timer__bar-fill" style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  )
}
