import { useTranslation } from 'react-i18next'
import { PhotoHero } from '@shared/organisms/photo-hero'
import { HOME_HERO_HEIGHT_REM } from '../../constants/home-hero'
import type { NextWorkoutCardProps } from './next-workout-card.types'
import './next-workout-card.scss'

export const NextWorkoutCard = ({
  title,
  durationMinutes,
  exerciseCount,
  imageUrl,
  dateLabel,
  streakCount,
  status,
}: NextWorkoutCardProps) => {
  const { t } = useTranslation('home')
  const metaLabel = t('nextWorkout.meta', { duration: durationMinutes, count: exerciseCount })

  return (
    <PhotoHero
      imageUrl={imageUrl}
      alt={title}
      title={title}
      meta={metaLabel}
      heightRem={HOME_HERO_HEIGHT_REM}
      topLeft={
        <span className="next-workout-card__top-left">
          <span className="next-workout-card__date-chip">{dateLabel}</span>
          {status === 'done' && (
            <span className="next-workout-card__done-badge">
              <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <path
                  d="M12 25 L20 33 L37 14"
                  stroke="currentColor"
                  strokeWidth={4.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t('nextWorkout.completedBadge')}
            </span>
          )}
          {status === 'missed' && (
            <span className="next-workout-card__missed-badge">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </svg>
              {t('nextWorkout.missedBadge')}
            </span>
          )}
        </span>
      }
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
