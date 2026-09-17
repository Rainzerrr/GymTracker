import { useTranslation } from 'react-i18next'
import { PhotoHero } from '@shared/organisms/photo-hero'
import type { NextWorkoutCardProps } from './next-workout-card.types'
import './next-workout-card.scss'

export const NextWorkoutCard = ({
  title,
  durationMinutes,
  exerciseCount,
  imageUrl,
  dateLabel,
  streakCount,
}: NextWorkoutCardProps) => {
  const { t } = useTranslation('home')
  const metaLabel = t('nextWorkout.meta', { duration: durationMinutes, count: exerciseCount })

  return (
    <PhotoHero
      imageUrl={imageUrl}
      alt={title}
      title={title}
      meta={metaLabel}
      heightRem={13.125}
      topLeft={<span className="next-workout-card__date-chip">{dateLabel}</span>}
      topRight={
        <span className="next-workout-card__streak-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path d="M12 2c1 4-3 5-3 9a3 3 0 006 0c0-1-.5-2-1-2 1 3-1 4-2 4a2 2 0 01-2-2c0-3 3-4 2-9z" />
          </svg>
          {streakCount}
        </span>
      }
    />
  )
}
