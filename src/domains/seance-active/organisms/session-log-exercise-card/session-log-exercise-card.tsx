import { useTranslation } from 'react-i18next'
import { Thumbnail } from '@shared/atoms/thumbnail'
import { NumberField } from '@shared/molecules/number-field'
import type { SessionLogExerciseCardProps } from './session-log-exercise-card.types'
import './session-log-exercise-card.scss'

export const SessionLogExerciseCard = ({
  name,
  thumbnailUrl,
  isBodyweight,
  sets,
  onWeightChange,
  onRepsChange,
}: SessionLogExerciseCardProps) => {
  const { t } = useTranslation('seanceActive')

  return (
    <div className="session-log-exercise-card">
      <div className="session-log-exercise-card__header">
        <Thumbnail src={thumbnailUrl} alt={name} />
        <span className="session-log-exercise-card__name">{name}</span>
      </div>

      {sets.map((set, index) => (
        <div key={index} className="session-log-exercise-card__set">
          <span className="session-log-exercise-card__set-label">
            {t('log.setLabel', { number: index + 1 })}
          </span>
          <div className="session-log-exercise-card__set-fields">
            {!isBodyweight && (
              <NumberField
                label={t('weight')}
                value={set.weight}
                onChange={(value) => onWeightChange(index, value)}
              />
            )}
            <NumberField label={t('reps')} value={set.reps} onChange={(value) => onRepsChange(index, value)} />
          </div>
        </div>
      ))}
    </div>
  )
}
