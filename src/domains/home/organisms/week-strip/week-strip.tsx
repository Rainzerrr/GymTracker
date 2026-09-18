import { WeekStripDay } from '../../molecules/week-strip-day'
import type { WeekStripProps } from './week-strip.types'
import './week-strip.scss'

export const WeekStrip = ({ days, selectedIndex, onSelectDay }: WeekStripProps) => {
  return (
    <div className="week-strip">
      {days.map((day) => (
        <WeekStripDay
          key={day.index}
          date={day.date}
          initial={day.initial}
          status={day.status}
          isToday={day.isToday}
          isSelected={day.index === selectedIndex}
          onClick={() => onSelectDay(day.index)}
        />
      ))}
    </div>
  )
}
