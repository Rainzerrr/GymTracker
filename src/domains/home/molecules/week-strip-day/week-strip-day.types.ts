import type { WeekDayStatus } from '../../types/week-day-status'

export type WeekStripDayProps = {
  date: Date
  initial: string
  status: WeekDayStatus
  isToday: boolean
  isSelected: boolean
  onClick: () => void
}
