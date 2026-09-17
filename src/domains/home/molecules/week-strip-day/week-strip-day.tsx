import type { WeekStripDayProps } from './week-strip-day.types'
import './week-strip-day.scss'

export const WeekStripDay = ({ initial, status, isToday }: WeekStripDayProps) => {
  const dotVariant = isToday ? 'today' : status
  const letterClassName = ['week-strip-day__letter', isToday && 'week-strip-day__letter--today']
    .filter(Boolean)
    .join(' ')

  return (
    <div className="week-strip-day">
      <span className={letterClassName}>{initial}</span>
      <span className={`week-strip-day__dot week-strip-day__dot--${dotVariant}`} />
    </div>
  )
}
