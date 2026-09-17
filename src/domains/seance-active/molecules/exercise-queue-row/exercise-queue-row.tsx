import { Thumbnail } from '@shared/atoms/thumbnail'
import { SetDots } from '../set-dots'
import type { ExerciseQueueRowProps } from './exercise-queue-row.types'
import './exercise-queue-row.scss'

export const ExerciseQueueRow = ({
  name,
  thumbnailUrl,
  targetLabel,
  setCount,
  completedSets,
  isActive,
  onClick,
}: ExerciseQueueRowProps) => {
  const className = `exercise-queue-row ${isActive ? 'exercise-queue-row--active' : ''}`

  return (
    <button type="button" className={className} onClick={onClick}>
      <span className="exercise-queue-row__leading">
        <Thumbnail src={thumbnailUrl} alt={name} />
        <span className="exercise-queue-row__text">
          <span className="exercise-queue-row__name">{name}</span>
          <span className="exercise-queue-row__target">{targetLabel}</span>
        </span>
      </span>
      <SetDots total={setCount} filled={completedSets} />
    </button>
  )
}
