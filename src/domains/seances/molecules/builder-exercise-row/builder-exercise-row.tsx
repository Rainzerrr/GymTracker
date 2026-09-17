import { useTranslation } from 'react-i18next'
import { Thumbnail } from '@shared/atoms/thumbnail'
import type { BuilderExerciseRowProps } from './builder-exercise-row.types'
import './builder-exercise-row.scss'

export const BuilderExerciseRow = ({
  name,
  thumbnailUrl,
  targetLabel,
  restLabel,
  onTargetChange,
  onRemove,
}: BuilderExerciseRowProps) => {
  const { t } = useTranslation('common')

  return (
    <div className="builder-exercise-row">
      <svg className="builder-exercise-row__handle" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="8" cy="6" r="1.3" />
        <circle cx="8" cy="12" r="1.3" />
        <circle cx="8" cy="18" r="1.3" />
        <circle cx="14" cy="6" r="1.3" />
        <circle cx="14" cy="12" r="1.3" />
        <circle cx="14" cy="18" r="1.3" />
      </svg>
      <Thumbnail src={thumbnailUrl} alt={name} />
      <div className="builder-exercise-row__body">
        <div className="builder-exercise-row__name">{name}</div>
        <input
          className="builder-exercise-row__target"
          type="text"
          value={targetLabel}
          onChange={(event) => onTargetChange(event.target.value)}
        />
        <div className="builder-exercise-row__rest">{restLabel}</div>
      </div>
      <button
        type="button"
        className="builder-exercise-row__remove"
        onClick={onRemove}
        aria-label={t('actions.delete')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  )
}
