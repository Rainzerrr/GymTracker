import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BackHeader } from '@shared/molecules/back-header'
import { PageTemplate } from '@shared/templates/page-template'
import { useSessions } from '../../hooks/use-sessions'
import { SessionBuilderForm } from '../../organisms/session-builder-form'
import type { SessionExercise } from '../../types/session-exercise'
import type { SessionDraft } from '../../types/workout-session'
import { generateSessionName } from '../../utils/generate-session-name'

const EMPTY_DRAFT: SessionDraft = { name: '', focusLabel: '', imageUrl: '', exercises: [] }

export const SessionBuilderPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('seances')
  const { sessions, getSession, createSession, updateSession } = useSessions()

  const isNew = sessionId === 'nouvelle'
  const existingSession = !isNew ? getSession(sessionId!) : undefined
  const otherSessions = sessions.filter((session) => session.id !== sessionId)

  const [draft, setDraft] = useState<SessionDraft>(() => {
    const relayedDraft = (location.state as { draft?: SessionDraft } | null)?.draft
    if (relayedDraft) {
      const generated = generateSessionName(relayedDraft.exercises, otherSessions)
      return generated ? { ...relayedDraft, ...generated } : relayedDraft
    }
    if (existingSession) {
      const { name, focusLabel, imageUrl, exercises } = existingSession
      return { name, focusLabel, imageUrl, exercises }
    }
    return EMPTY_DRAFT
  })

  useEffect(() => {
    if (!isNew && !existingSession) {
      navigate('/seances', { replace: true })
    }
  }, [isNew, existingSession, navigate])

  const handleExerciseTargetChange = (exerciseId: string, value: string) => {
    setDraft((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, targetLabel: value } : exercise,
      ),
    }))
  }

  const handleExerciseRemove = (exerciseId: string) => {
    setDraft((current) => {
      const exercises = current.exercises.filter((exercise) => exercise.id !== exerciseId)
      const generated = generateSessionName(exercises, otherSessions)
      return { ...current, ...generated, exercises }
    })
  }

  const handleToggleSuperset = (exerciseId: string) => {
    setDraft((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, linkedToNext: !exercise.linkedToNext }
          : exercise,
      ),
    }))
  }

  const handleReorderExercises = (exercises: SessionExercise[]) => {
    setDraft((current) => ({
      ...current,
      exercises: exercises.map((exercise) => ({ ...exercise, linkedToNext: false })),
    }))
  }

  const handleAddExercise = () => {
    navigate('/seances/exercices', { state: { returnTo: sessionId, draft } })
  }

  const handleSave = () => {
    if (isNew) {
      const created = createSession(draft)
      navigate(`/seances/${created.id}`, { replace: true })
      return
    }

    updateSession(sessionId!, draft)
    navigate('/seances')
  }

  return (
    <PageTemplate
      header={<BackHeader title={t('builder.headerTitle')} onBack={() => navigate('/seances')} />}
    >
      <SessionBuilderForm
        draft={draft}
        onNameChange={(value) => setDraft((current) => ({ ...current, name: value }))}
        onExerciseTargetChange={handleExerciseTargetChange}
        onExerciseRemove={handleExerciseRemove}
        onToggleSuperset={handleToggleSuperset}
        onReorderExercises={handleReorderExercises}
        onAddExercise={handleAddExercise}
        onSave={handleSave}
      />
    </PageTemplate>
  )
}
