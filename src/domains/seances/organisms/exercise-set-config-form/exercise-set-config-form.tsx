import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { FilterPill } from '@shared/atoms/filter-pill'
import { NumberField } from '@shared/molecules/number-field'
import { Stepper } from '@shared/molecules/stepper'
import { REST_OPTIONS } from '../../data/rest-options'
import type { ExerciseSetConfigFormProps } from './exercise-set-config-form.types'
import './exercise-set-config-form.scss'

export const ExerciseSetConfigForm = ({
  exerciseName,
  exerciseMeta,
  photoUrl,
  sets,
  onSetsChange,
  allowMaxObjective,
  isMaxObjective,
  onMaxObjectiveChange,
  repsMin,
  onRepsMinChange,
  repsMax,
  onRepsMaxChange,
  restLabel,
  onRestLabelChange,
  onSubmit,
}: ExerciseSetConfigFormProps) => {
  const { t } = useTranslation('seances')

  return (
    <div className="exercise-set-config-form">
      <img className="exercise-set-config-form__photo" src={photoUrl} alt={exerciseName} />

      <div className="exercise-set-config-form__header">
        <span className="exercise-set-config-form__name">{exerciseName}</span>
        <span className="exercise-set-config-form__meta">{exerciseMeta}</span>
      </div>

      <div className="exercise-set-config-form__field-group">
        <span className="exercise-set-config-form__label">{t('config.sets')}</span>
        <Stepper value={sets} onChange={onSetsChange} />
      </div>

      {allowMaxObjective && (
        <div className="exercise-set-config-form__field-group">
          <span className="exercise-set-config-form__label">{t('config.objective')}</span>
          <div className="exercise-set-config-form__objective-options">
            <FilterPill
              label={t('config.objectiveRange')}
              active={!isMaxObjective}
              onClick={() => onMaxObjectiveChange(false)}
            />
            <FilterPill
              label={t('config.objectiveMax')}
              active={isMaxObjective}
              onClick={() => onMaxObjectiveChange(true)}
            />
          </div>
        </div>
      )}

      {isMaxObjective ? (
        <p className="exercise-set-config-form__hint">{t('config.objectiveMaxHint')}</p>
      ) : (
        <div className="exercise-set-config-form__field-row">
          <NumberField label={t('config.repsMin')} value={repsMin} onChange={onRepsMinChange} />
          <NumberField label={t('config.repsMax')} value={repsMax} onChange={onRepsMaxChange} />
        </div>
      )}

      <div className="exercise-set-config-form__field-group">
        <span className="exercise-set-config-form__label">{t('config.restLabel')}</span>
        <div className="exercise-set-config-form__rest-options">
          {REST_OPTIONS.map((option) => (
            <FilterPill
              key={option}
              label={option}
              active={restLabel === option}
              onClick={() => onRestLabelChange(option)}
            />
          ))}
        </div>
      </div>

      <Button label={t('config.submit')} variant="accent" fullWidth onClick={onSubmit} />
    </div>
  )
}
