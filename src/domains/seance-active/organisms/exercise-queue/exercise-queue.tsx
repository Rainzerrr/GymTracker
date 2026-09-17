import { ExerciseQueueRow } from '../../molecules/exercise-queue-row'
import type { ExerciseQueueProps } from './exercise-queue.types'

export const ExerciseQueue = ({ exercises, onSelect }: ExerciseQueueProps) => {
  return (
    <div className="exercise-queue">
      {exercises.map((exercise, index) => (
        <ExerciseQueueRow
          key={exercise.id}
          name={exercise.name}
          thumbnailUrl={exercise.thumbnailUrl}
          targetLabel={exercise.targetLabel}
          setCount={exercise.setCount}
          completedSets={exercise.completedSets}
          isActive={exercise.isActive}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  )
}
