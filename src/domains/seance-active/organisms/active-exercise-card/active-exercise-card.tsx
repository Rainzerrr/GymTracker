import { useTranslation } from 'react-i18next'
import { formatDurationClock } from '@shared/utils/date/format-duration-clock'
import { RirSelector } from '../../molecules/rir-selector'
import type { ActiveExerciseCardProps } from './active-exercise-card.types'
import './active-exercise-card.scss'

export const ActiveExerciseCard = ({
  name,
  photoUrl,
  currentSetNumber,
  totalSets,
  targetLabel,
  reps,
  onRepsChange,
  selectedRir,
  onSelectRir,
  isResting,
  restRemainingSeconds,
  restTotalSeconds,
  onValidate,
}: ActiveExerciseCardProps) => {
  const { t } = useTranslation('seanceActive')
  const setSubtitle = t('setLabel', { current: currentSetNumber, total: totalSets, label: targetLabel })
  const restProgressPercent = ((restTotalSeconds - restRemainingSeconds) / restTotalSeconds) * 100

  return (
    <div className="active-exercise-card">
      <img className="active-exercise-card__photo" src={photoUrl} alt={name} />

      <div className="active-exercise-card__header">
        <span className="active-exercise-card__name">{name}</span>
        <span className="active-exercise-card__set">{setSubtitle}</span>
      </div>

      <div className="active-exercise-card__field-row">
        <div className="active-exercise-card__field">
          <span className="active-exercise-card__field-label">{t('reps')}</span>
          <input
            className="active-exercise-card__field-value"
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(event) => onRepsChange(Number(event.target.value))}
          />
        </div>
        <div className="active-exercise-card__field">
          <span className="active-exercise-card__field-label">{t('rir')}</span>
          <span className="active-exercise-card__field-value">
            {selectedRir === 'echec' ? t('rirFailure') : (selectedRir ?? '—')}
          </span>
        </div>
      </div>

      <RirSelector value={selectedRir} onChange={onSelectRir} />

      {isResting && (
        <div className="active-exercise-card__rest">
          <div className="active-exercise-card__rest-row">
            <span>{t('rest')}</span>
            <span>{t('restRemaining', { time: formatDurationClock(restRemainingSeconds) })}</span>
          </div>
          <div className="active-exercise-card__rest-bar">
            <div className="active-exercise-card__rest-bar-fill" style={{ width: `${restProgressPercent}%` }} />
          </div>
        </div>
      )}

      <button type="button" className="active-exercise-card__validate" onClick={onValidate} disabled={isResting}>
        {isResting ? t('resting') : t('validate')}
      </button>
    </div>
  )
}
