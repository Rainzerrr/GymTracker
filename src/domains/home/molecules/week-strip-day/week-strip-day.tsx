import type { WeekStripDayProps } from './week-strip-day.types'
import './week-strip-day.scss'

export const WeekStripDay = ({ initial, status, isToday, isSelected, onClick }: WeekStripDayProps) => {
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

  return (
    <button type="button" className={rootClassName} onClick={onClick}>
      <span className={letterClassName}>{initial}</span>
      <span className={dotClassName} />
    </button>
  )
}
