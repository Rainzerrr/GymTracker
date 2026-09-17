import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { FilterPill } from '@shared/atoms/filter-pill'
import { NumberField } from '@shared/molecules/number-field'
import { Stepper } from '@shared/molecules/stepper'
import type { ExerciseSetConfigFormProps } from './exercise-set-config-form.types'
import './exercise-set-config-form.scss'

const REST_OPTIONS = ['60s', '90s', '2min', '2min30', '3min']

export const ExerciseSetConfigForm = ({
  exerciseName,
  exerciseMeta,
  photoUrl,
  sets,
  onSetsChange,
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

      <div className="exercise-set-config-form__field-row">
        <NumberField label={t('config.repsMin')} value={repsMin} onChange={onRepsMinChange} />
        <NumberField label={t('config.repsMax')} value={repsMax} onChange={onRepsMaxChange} />
      </div>

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
