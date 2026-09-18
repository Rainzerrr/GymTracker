import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { useNumberInputField } from '@shared/hooks/use-number-input-field'
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
  supersetSize,
  supersetPosition,
  reps,
  onRepsChange,
  weight,
  onWeightChange,
  isBodyweight,
  selectedRir,
  onSelectRir,
  isResting,
  restRemainingSeconds,
  restTotalSeconds,
  onStartRest,
  onStopRest,
  onValidate,
  onSkipSet,
  onSkipExercise,
}: ActiveExerciseCardProps) => {
  const { t } = useTranslation('seanceActive')
  const weightField = useNumberInputField(weight, onWeightChange)
  const repsField = useNumberInputField(reps, onRepsChange)
  const setSubtitle = t('setLabel', {
    current: currentSetNumber,
    total: totalSets,
    label: targetLabel,
  })
  const restProgressPercent = isResting
    ? ((restTotalSeconds - restRemainingSeconds) / restTotalSeconds) * 100
    : 0

  return (
    <div className="active-exercise-card">
      <img className="active-exercise-card__photo" src={photoUrl} alt={name} />

      <div className="active-exercise-card__header">
        {supersetSize > 1 && (
          <span className="active-exercise-card__superset-badge">
            {t('supersetBadge', { position: supersetPosition, size: supersetSize })}
          </span>
        )}
        <span className="active-exercise-card__name">{name}</span>
        <span className="active-exercise-card__set">{setSubtitle}</span>
      </div>

      <div className="active-exercise-card__field-row">
        {!isBodyweight && (
          <div className="active-exercise-card__field">
            <span className="active-exercise-card__field-label">{t('weight')}</span>
            <input
              className="active-exercise-card__field-value"
              type="number"
              inputMode="decimal"
              step={2.5}
              min={0}
              value={weightField.rawValue}
              onChange={weightField.handleChange}
              onBlur={weightField.handleBlur}
            />
          </div>
        )}
        <div className="active-exercise-card__field">
          <span className="active-exercise-card__field-label">{t('reps')}</span>
          <input
            className="active-exercise-card__field-value"
            type="number"
            inputMode="numeric"
            min={0}
            value={repsField.rawValue}
            onChange={repsField.handleChange}
            onBlur={repsField.handleBlur}
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

      <div className="active-exercise-card__skip-row">
        <div className="active-exercise-card__skip-item">
          <Button label={t('skipSet')} variant="outline" fullWidth onClick={onSkipSet} />
        </div>
        <div className="active-exercise-card__skip-item">
          <Button label={t('skipExercise')} variant="outline" fullWidth onClick={onSkipExercise} />
        </div>
      </div>

      <div className="active-exercise-card__rest">
        <div className="active-exercise-card__rest-row">
          <span>{t('rest')}</span>
          <span>
            {isResting
              ? t('restRemaining', { time: formatDurationClock(restRemainingSeconds) })
              : formatDurationClock(restTotalSeconds)}
          </span>
          <button
            type="button"
            className="active-exercise-card__rest-toggle"
            onClick={isResting ? onStopRest : onStartRest}
          >
            {isResting ? t('restStop') : t('restStart')}
          </button>
        </div>
        <div className="active-exercise-card__rest-bar">
          <div
            className="active-exercise-card__rest-bar-fill"
            style={{ width: `${restProgressPercent}%` }}
          />
        </div>
      </div>

      <button type="button" className="active-exercise-card__validate" onClick={onValidate}>
        {t('validate')}
      </button>
    </div>
  )
}
