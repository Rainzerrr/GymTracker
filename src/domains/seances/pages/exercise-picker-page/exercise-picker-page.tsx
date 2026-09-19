import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { BackHeader } from '@shared/molecules/back-header'
import { PageTemplate } from '@shared/templates/page-template'
import { useExerciseLibrary } from '../../hooks/use-exercise-library'
import { ExercisePickerList } from '../../organisms/exercise-picker-list'
import type { LibraryExercise } from '../../types/library-exercise'
import type { SessionDraft } from '../../types/workout-session'

type PickerRelayState = { returnTo?: string; draft?: SessionDraft } | null

export const ExercisePickerPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('seances')
  const { results, totalCount, search, setSearch, muscleGroup, setMuscleGroup } = useExerciseLibrary()

  const relay = location.state as PickerRelayState
  const backTarget = relay?.returnTo ? `/seances/${relay.returnTo}` : '/seances'

  const handleSelect = (exercise: LibraryExercise) => {
    navigate(`/seances/exercices/${exercise.id}/configurer`, { state: relay })
  }

  return (
    <PageTemplate
      header={
        <BackHeader
          title={t('picker.headerTitle')}
          onBack={() => navigate(backTarget, { state: { draft: relay?.draft } })}
        />
      }
    >
      <ExercisePickerList
        results={results}
        totalCount={totalCount}
        search={search}
        onSearchChange={setSearch}
        muscleGroup={muscleGroup}
        onMuscleGroupChange={setMuscleGroup}
        onSelect={handleSelect}
      />
    </PageTemplate>
  )
}
