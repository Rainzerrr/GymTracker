import { useTranslation } from 'react-i18next'
import { getTodayLabel } from '@shared/utils/date/get-today-label'
import type { WeekStripDayProps } from './week-strip-day.types'
import './week-strip-day.scss'

export const WeekStripDay = ({
  date,
  initial,
  status,
  isToday,
  isSelected,
  onClick,
}: WeekStripDayProps) => {
  const { t } = useTranslation('home')
  const rootClassName = ['week-strip-day', isSelected && 'week-strip-day--selected']
    .filter(Boolean)
    .join(' ')
  const letterClassName = ['week-strip-day__letter', isToday && 'week-strip-day__letter--today']
    .filter(Boolean)
    .join(' ')
  const dotClassName = [
    'week-strip-day__dot',
    `week-strip-day__dot--${status}`,
    isToday && 'week-strip-day__dot--today',
  ]
    .filter(Boolean)
    .join(' ')
  const ariaLabel = `${getTodayLabel(date)} — ${t(`weekStrip.status.${status}`)}`

  return (
    <button type="button" className={rootClassName} onClick={onClick} aria-label={ariaLabel}>
      <span className={letterClassName} aria-hidden="true">
        {initial}
      </span>
      <span className={dotClassName} aria-hidden="true" />
    </button>
  )
}
