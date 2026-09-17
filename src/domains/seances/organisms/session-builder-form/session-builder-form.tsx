import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { SectionLabel } from '@shared/atoms/section-label'
import { BuilderExerciseRow } from '../../molecules/builder-exercise-row'
import { SupersetLinkButton } from '../../molecules/superset-link-button'
import type { SessionBuilderFormProps } from './session-builder-form.types'
import './session-builder-form.scss'

export const SessionBuilderForm = ({
  draft,
  onNameChange,
  onExerciseTargetChange,
  onExerciseRemove,
  onToggleSuperset,
  onAddExercise,
  onSave,
}: SessionBuilderFormProps) => {
  const { t } = useTranslation('seances')
  const subtitle = draft.focusLabel
    ? t('builder.subtitleWithFocus', { focus: draft.focusLabel, count: draft.exercises.length })
    : t('builder.subtitle', { count: draft.exercises.length })

  return (
    <div className="session-builder-form">
      <div className="session-builder-form__header">
        <input
          className="session-builder-form__name"
          type="text"
          value={draft.name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder={t('builder.namePlaceholder')}
        />
        <p className="session-builder-form__subtitle">{subtitle}</p>
      </div>

      <SectionLabel label={t('builder.exercisesLabel')} />

      <div>
        {draft.exercises.map((exercise, index) => (
          <div key={exercise.id}>
            <BuilderExerciseRow
              name={exercise.name}
              thumbnailUrl={exercise.thumbnailUrl}
              targetLabel={exercise.targetLabel}
              restLabel={exercise.restLabel}
              onTargetChange={(value) => onExerciseTargetChange(exercise.id, value)}
              onRemove={() => onExerciseRemove(exercise.id)}
            />
            {index < draft.exercises.length - 1 && (
              <SupersetLinkButton linked={exercise.linkedToNext} onToggle={() => onToggleSuperset(exercise.id)} />
            )}
          </div>
        ))}
      </div>

      <div className="session-builder-form__actions">
        <Button label={t('builder.addExercise')} variant="outline" fullWidth onClick={onAddExercise} />
        <Button label={t('builder.save')} variant="accent" fullWidth onClick={onSave} />
      </div>
    </div>
  )
}
