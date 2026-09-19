import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { useNumberInputField } from '@shared/hooks/use-number-input-field'
import { resolveImageUrl } from '@shared/utils/image/image-url'
import { RestTimer } from '../../molecules/rest-timer'
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
  restSeconds,
  onValidate,
  onSkipSet,
  onSkipExercise,
  lastPerformanceLabel,
  nextTargetLabel,
}: ActiveExerciseCardProps) => {
  const { t } = useTranslation('seanceActive')
  const weightField = useNumberInputField(weight, onWeightChange)
  const repsField = useNumberInputField(reps, onRepsChange)
  const setSubtitle = t('setLabel', {
    current: currentSetNumber,
    total: totalSets,
    label: targetLabel,
  })

  return (
    <div className="active-exercise-card">
      <img className="active-exercise-card__photo" src={resolveImageUrl(photoUrl)} alt={name} />

      <div className="active-exercise-card__header">
        {supersetSize > 1 && (
          <span className="active-exercise-card__superset-badge">
            {t('supersetBadge', { position: supersetPosition, size: supersetSize })}
          </span>
        )}
        <span className="active-exercise-card__name">{name}</span>
        <span className="active-exercise-card__set">{setSubtitle}</span>
        {lastPerformanceLabel && (
          <span className="active-exercise-card__last">{lastPerformanceLabel}</span>
        )}
        {nextTargetLabel && <span className="active-exercise-card__target">{nextTargetLabel}</span>}
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

      <RestTimer restSeconds={restSeconds} />

      <button type="button" className="active-exercise-card__validate" onClick={onValidate}>
        {t('validate')}
      </button>
    </div>
  )
}
