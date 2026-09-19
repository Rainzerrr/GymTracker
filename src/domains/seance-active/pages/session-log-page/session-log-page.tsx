import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button } from '@shared/atoms/button'
import { BackHeader } from '@shared/molecules/back-header'
import { PageTemplate } from '@shared/templates/page-template'
import { useSessionLogEditor } from '../../hooks/use-session-log-editor'
import { SessionLogExerciseCard } from '../../organisms/session-log-exercise-card'
import './session-log-page.scss'

export const SessionLogPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [searchParams] = useSearchParams()
  const dateIso = searchParams.get('date') ?? undefined
  const navigate = useNavigate()
  const { t } = useTranslation('seanceActive')
  const { session, isFutureDate, exercises, updateSet, save } = useSessionLogEditor(
    sessionId,
    dateIso,
  )

  useEffect(() => {
    if (!session || isFutureDate) {
      navigate('/', { replace: true })
    }
  }, [session, isFutureDate, navigate])

  if (!session || isFutureDate) {
    return null
  }

  const handleSave = () => {
    save()
    navigate('/')
  }

  return (
    <PageTemplate header={<BackHeader title={session.name} onBack={() => navigate('/')} />}>
      <div className="session-log-page__list">
        {exercises.map((exercise, index) => (
          <SessionLogExerciseCard
            key={exercise.libraryExerciseId}
            name={exercise.name}
            thumbnailUrl={exercise.thumbnailUrl}
            isBodyweight={exercise.isBodyweight}
            sets={exercise.sets}
            onWeightChange={(setIndex, value) => updateSet(index, setIndex, 'weight', value)}
            onRepsChange={(setIndex, value) => updateSet(index, setIndex, 'reps', value)}
          />
        ))}
      </div>
      <Button label={t('log.save')} variant="accent" fullWidth onClick={handleSave} />
    </PageTemplate>
  )
}
