import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { SectionLabel } from '@shared/atoms/section-label'
import { useReorderableList } from '../../hooks/use-reorderable-list'
import { BuilderExerciseRow } from '../../molecules/builder-exercise-row'
import { SupersetLinkButton } from '../../molecules/superset-link-button'
import type { SessionExercise } from '../../types/session-exercise'
import { groupExercisesBySuperset } from '../../utils/group-exercises-by-superset'
import type { SessionBuilderFormProps } from './session-builder-form.types'
import './session-builder-form.scss'

export const SessionBuilderForm = ({
  draft,
  onNameChange,
  onExerciseTargetChange,
  onExerciseRemove,
  onToggleSuperset,
  onReorderExercises,
  onAddExercise,
  onSave,
}: SessionBuilderFormProps) => {
  const { t } = useTranslation('seances')
  const subtitle = draft.focusLabel
    ? t('builder.subtitleWithFocus', { focus: draft.focusLabel, count: draft.exercises.length })
    : t('builder.subtitle', { count: draft.exercises.length })

  const { draggingId, dragOffset, registerItemRef, handlePointerDown } = useReorderableList<SessionExercise>({
    items: draft.exercises,
    getId: (exercise) => exercise.id,
    onReorder: onReorderExercises,
  })

  const groups = groupExercisesBySuperset(draft.exercises)

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
        {groups.map((group, groupIndex) => (
          <Fragment key={group[0].id}>
            <div
              className={`session-builder-form__group ${
                group.length > 1 ? 'session-builder-form__group--superset' : ''
              }`}
            >
              {group.length > 1 && (
                <span className="session-builder-form__group-label">
                  {t('builder.supersetGroupLabel', { count: group.length })}
                </span>
              )}
              {group.map((exercise, memberIndex) => (
                <div key={exercise.id}>
                  <BuilderExerciseRow
                    rowRef={registerItemRef(exercise.id)}
                    name={exercise.name}
                    thumbnailUrl={exercise.thumbnailUrl}
                    targetLabel={exercise.targetLabel}
                    restLabel={exercise.restLabel}
                    onTargetChange={(value) => onExerciseTargetChange(exercise.id, value)}
                    onRemove={() => onExerciseRemove(exercise.id)}
                    onHandlePointerDown={handlePointerDown(exercise.id)}
                    isDragging={draggingId === exercise.id}
                    dragOffset={dragOffset}
                  />
                  {memberIndex < group.length - 1 && (
                    <SupersetLinkButton linked onToggle={() => onToggleSuperset(exercise.id)} />
                  )}
                </div>
              ))}
            </div>
            {groupIndex < groups.length - 1 && (
              <SupersetLinkButton
                linked={false}
                onToggle={() => onToggleSuperset(group[group.length - 1].id)}
              />
            )}
          </Fragment>
        ))}
      </div>

      <div className="session-builder-form__actions">
        <Button label={t('builder.addExercise')} variant="outline" fullWidth onClick={onAddExercise} />
        <Button label={t('builder.save')} variant="accent" fullWidth onClick={onSave} />
      </div>
    </div>
  )
}
