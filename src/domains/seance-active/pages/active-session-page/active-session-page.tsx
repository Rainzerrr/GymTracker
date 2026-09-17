import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useActiveSession } from '../../hooks/use-active-session'
import { ActiveExerciseCard } from '../../organisms/active-exercise-card'
import { ExerciseQueue } from '../../organisms/exercise-queue'
import { SessionHeader } from '../../organisms/session-header'
import './active-session-page.scss'

export const ActiveSessionPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const {
    session,
    exercises,
    currentExercise,
    currentSetNumber,
    reps,
    setReps,
    weight,
    setWeight,
    selectedRir,
    selectRir,
    isResting,
    restRemainingSeconds,
    restTotalSeconds,
    elapsedSeconds,
    isSessionComplete,
    validateSet,
    selectExercise,
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

  if (!session || !currentExercise) {
    return null
  }

  return (
    <div className="active-session-page">
      <SessionHeader
        title={session.name}
        elapsedSeconds={elapsedSeconds}
        onBack={() => navigate('/')}
      />
      <ActiveExerciseCard
        name={currentExercise.name}
        photoUrl={currentExercise.thumbnailUrl}
        currentSetNumber={currentSetNumber}
        totalSets={currentExercise.setCount}
        targetLabel={currentExercise.targetLabel}
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
        onValidate={validateSet}
      />
      <ExerciseQueue exercises={exercises} onSelect={selectExercise} />
    </div>
  )
}
