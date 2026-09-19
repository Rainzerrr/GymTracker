import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@shared/atoms/button'
import { ConfirmAction } from '@shared/molecules/confirm-action'
import { PageTemplate } from '@shared/templates/page-template'
import { useActiveSession } from '../../hooks/use-active-session'
import { ExerciseNote } from '../../molecules/exercise-note'
import { ActiveExerciseCard } from '../../organisms/active-exercise-card'
import { ExerciseQueue } from '../../organisms/exercise-queue'
import { SessionHeader } from '../../organisms/session-header'
import { formatLastSets, formatNextTarget } from '../../utils/build-history-labels'

export const ActiveSessionPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation('seanceActive')
  const {
    session,
    exercises,
    currentExercise,
    currentSetNumber,
    supersetSize,
    supersetPosition,
    reps,
    setReps,
    weight,
    setWeight,
    selectedRir,
    selectRir,
    startedAt,
    isSessionComplete,
    validateSet,
    skipSet,
    skipExercise,
    selectExercise,
    lastSets,
    nextTarget,
    canUndo,
    undoLastStep,
    note,
    setNote,
    abandonSession,
  } = useActiveSession(sessionId)

  useEffect(() => {
    if (!session) {
      navigate('/', { replace: true })
    }
  }, [session, navigate])

  useEffect(() => {
    if (isSessionComplete) {
      navigate('/seance-recap', { replace: true })
    }
  }, [isSessionComplete, navigate])

  if (!session || !currentExercise || isSessionComplete) {
    return null
  }

  const lastPerformanceLabel = lastSets ? formatLastSets(t, lastSets) : undefined
  const nextTargetLabel = nextTarget
    ? formatNextTarget(t, nextTarget, currentExercise.isBodyweight)
    : undefined

  const handleAbandon = () => {
    abandonSession()
    navigate('/', { replace: true })
  }

  return (
    <PageTemplate
      header={
        <SessionHeader title={session.name} startedAt={startedAt} onBack={() => navigate('/')} />
      }
    >
      <ActiveExerciseCard
        name={currentExercise.name}
        photoUrl={currentExercise.thumbnailUrl}
        currentSetNumber={currentSetNumber}
        totalSets={currentExercise.setCount}
        targetLabel={currentExercise.targetLabel}
        supersetSize={supersetSize}
        supersetPosition={supersetPosition}
        reps={reps}
        onRepsChange={setReps}
        weight={weight}
        onWeightChange={setWeight}
        isBodyweight={currentExercise.isBodyweight}
        selectedRir={selectedRir}
        onSelectRir={selectRir}
        restSeconds={currentExercise.restSeconds}
        onValidate={validateSet}
        onSkipSet={skipSet}
        onSkipExercise={skipExercise}
        lastPerformanceLabel={lastPerformanceLabel}
        nextTargetLabel={nextTargetLabel}
      />
      {canUndo && <Button label={t('undo')} variant="outline" fullWidth onClick={undoLastStep} />}
      <ExerciseNote value={note} onChange={setNote} />
      <ExerciseQueue exercises={exercises} onSelect={selectExercise} />
      <ConfirmAction
        triggerLabel={t('abandon.trigger')}
        triggerVariant="outline"
        warning={t('abandon.warning')}
        cancelLabel={t('abandon.cancel')}
        confirmLabel={t('abandon.confirm')}
        onConfirm={handleAbandon}
      />
    </PageTemplate>
  )
}
