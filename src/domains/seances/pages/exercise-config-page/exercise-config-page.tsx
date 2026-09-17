import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BackHeader } from '@shared/molecules/back-header'
import { PageTemplate } from '@shared/templates/page-template'
import { getLibraryExercise } from '../../hooks/use-exercise-library'
import { ExerciseSetConfigForm } from '../../organisms/exercise-set-config-form'
import type { SessionExercise } from '../../types/session-exercise'
import type { SessionDraft } from '../../types/workout-session'

type ConfigRelayState = { returnTo?: string; draft?: SessionDraft } | null

const createExerciseId = () => `exercise-${Date.now()}-${Math.round(Math.random() * 10000)}`

export const ExerciseConfigPage = () => {
  const { libraryExerciseId } = useParams<{ libraryExerciseId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('seances')

  const relay = location.state as ConfigRelayState
  const libraryExercise = libraryExerciseId ? getLibraryExercise(libraryExerciseId) : undefined
  const isValid = Boolean(libraryExercise) && Boolean(relay?.returnTo)

  const [sets, setSets] = useState(3)
  const [repsMin, setRepsMin] = useState(10)
  const [repsMax, setRepsMax] = useState(12)
  const [restLabel, setRestLabel] = useState('90s')

  useEffect(() => {
    if (!isValid) {
      navigate('/seances', { replace: true })
    }
  }, [isValid, navigate])

  if (!libraryExercise || !relay?.returnTo) {
    return null
  }

  const backTarget = `/seances/${relay.returnTo}`

  const handleSubmit = () => {
    const newExercise: SessionExercise = {
      id: createExerciseId(),
      libraryExerciseId: libraryExercise.id,
      name: libraryExercise.name,
      thumbnailUrl: libraryExercise.thumbnailUrl,
      targetLabel: `${sets} × ${repsMin}-${repsMax}`,
      restLabel: t('config.restLabelValue', { value: restLabel }),
      linkedToNext: false,
    }

    const draft = relay.draft ?? { name: '', focusLabel: '', imageUrl: '', exercises: [] }

    navigate(backTarget, {
      replace: true,
      state: { draft: { ...draft, exercises: [...draft.exercises, newExercise] } },
    })
  }

  return (
    <PageTemplate>
      <BackHeader
        title={t('config.headerTitle')}
        onBack={() => navigate(backTarget, { state: { draft: relay.draft } })}
      />
      <ExerciseSetConfigForm
        exerciseName={libraryExercise.name}
        exerciseMeta={`${t(`muscleGroups.${libraryExercise.muscleGroup}`)} · ${libraryExercise.equipment}`}
        photoUrl={libraryExercise.thumbnailUrl}
        sets={sets}
        onSetsChange={setSets}
        repsMin={repsMin}
        onRepsMinChange={setRepsMin}
        repsMax={repsMax}
        onRepsMaxChange={setRepsMax}
        restLabel={restLabel}
        onRestLabelChange={setRestLabel}
        onSubmit={handleSubmit}
      />
    </PageTemplate>
  )
}
