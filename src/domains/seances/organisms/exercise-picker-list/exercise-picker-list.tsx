import { useTranslation } from 'react-i18next'
import { ChevronIcon } from '@shared/atoms/chevron-icon'
import { FilterPill } from '@shared/atoms/filter-pill'
import { Thumbnail } from '@shared/atoms/thumbnail'
import { ListRow } from '@shared/molecules/list-row'
import { MUSCLE_GROUPS } from '../../types/muscle-group'
import type { ExercisePickerListProps } from './exercise-picker-list.types'
import './exercise-picker-list.scss'

export const ExercisePickerList = ({
  results,
  totalCount,
  search,
  onSearchChange,
  muscleGroup,
  onMuscleGroupChange,
  onSelect,
}: ExercisePickerListProps) => {
  const { t } = useTranslation('seances')

  return (
    <div className="exercise-picker-list">
      <div className="exercise-picker-list__search">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t('picker.searchPlaceholder', { count: totalCount })}
        />
      </div>

      <div className="exercise-picker-list__filters">
        <FilterPill
          label={t('muscleGroups.all')}
          active={muscleGroup === 'all'}
          onClick={() => onMuscleGroupChange('all')}
        />
        {MUSCLE_GROUPS.map((group) => (
          <FilterPill
            key={group}
            label={t(`muscleGroups.${group}`)}
            active={muscleGroup === group}
            onClick={() => onMuscleGroupChange(group)}
          />
        ))}
      </div>

      <div className="exercise-picker-list__results">
        {results.map((exercise) => (
          <ListRow
            key={exercise.id}
            leading={<Thumbnail src={exercise.thumbnailUrl} alt={exercise.name} />}
            title={exercise.name}
            subtitle={t('picker.subtitle', {
              muscle: t(`muscleGroups.${exercise.muscleGroup}`),
              equipment: exercise.equipment,
            })}
            trailing={<ChevronIcon />}
            onClick={() => onSelect(exercise)}
          />
        ))}
      </div>
    </div>
  )
}
