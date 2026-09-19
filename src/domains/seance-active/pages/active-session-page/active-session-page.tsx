import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageTemplate } from '@shared/templates/page-template'
import { useActiveSession } from '../../hooks/use-active-session'
import { AbandonSession } from '../../organisms/abandon-session'
import { ActiveExerciseCard } from '../../organisms/active-exercise-card'
import { ExerciseQueue } from '../../organisms/exercise-queue'
import { SessionHeader } from '../../organisms/session-header'

export const ActiveSessionPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
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
    isResting,
    restRemainingSeconds,
    restTotalSeconds,
    startRest,
    stopRest,
    elapsedSeconds,
    isSessionComplete,
    validateSet,
    skipSet,
    skipExercise,
    selectExercise,
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

  const handleAbandon = () => {
    abandonSession()
    navigate('/', { replace: true })
  }

  return (
    <PageTemplate
      header={
        <SessionHeader
          title={session.name}
          elapsedSeconds={elapsedSeconds}
          onBack={() => navigate('/')}
        />
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
        isResting={isResting}
        restRemainingSeconds={restRemainingSeconds}
        restTotalSeconds={restTotalSeconds}
        onStartRest={startRest}
        onStopRest={stopRest}
        onValidate={validateSet}
        onSkipSet={skipSet}
        onSkipExercise={skipExercise}
      />
      <ExerciseQueue exercises={exercises} onSelect={selectExercise} />
      <AbandonSession onAbandon={handleAbandon} />
    </PageTemplate>
  )
}
