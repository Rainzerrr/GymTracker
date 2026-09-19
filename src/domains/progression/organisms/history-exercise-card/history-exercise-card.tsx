import { useTranslation } from 'react-i18next'
import { Thumbnail } from '@shared/atoms/thumbnail'
import type { HistoryExerciseCardProps } from './history-exercise-card.types'
import './history-exercise-card.scss'

export const HistoryExerciseCard = ({ name, thumbnailUrl, sets }: HistoryExerciseCardProps) => {
  const { t } = useTranslation('progression')

  return (
    <div className="history-exercise-card">
      <div className="history-exercise-card__header">
        <Thumbnail src={thumbnailUrl} alt={name} />
        <span className="history-exercise-card__name">{name}</span>
      </div>

      <ul className="history-exercise-card__sets">
        {sets.map((set, index) => (
          <li key={index} className="history-exercise-card__set">
            <span className="history-exercise-card__set-label">
              {t('sessionDetail.setLabel', { number: index + 1 })}
            </span>
            <span className="history-exercise-card__set-value">
              {set.weight > 0
                ? t('sessionDetail.weightReps', { weight: set.weight, reps: set.reps })
                : t('sessionDetail.repsOnly', { reps: set.reps })}
            </span>
            {set.rir !== null && (
              <span className="history-exercise-card__set-rir">
                {set.rir === 'echec' ? t('sessionDetail.rirFailure') : t('sessionDetail.rir', { value: set.rir })}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
