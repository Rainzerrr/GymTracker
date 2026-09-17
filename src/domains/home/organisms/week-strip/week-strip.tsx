import { WeekStripDay } from '../../molecules/week-strip-day'
import type { WeekStripProps } from './week-strip.types'
import './week-strip.scss'

export const WeekStrip = ({ days }: WeekStripProps) => {
  return (
    <div className="week-strip">
      {days.map((day) => (
        <WeekStripDay key={day.index} initial={day.initial} status={day.status} isToday={day.isToday} />
      ))}
    </div>
  )
}
