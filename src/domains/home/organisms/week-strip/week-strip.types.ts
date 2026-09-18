import type { WeekDayStatus } from '../../types/week-day-status'

export type WeekStripDayData = {
  index: number
  date: Date
  initial: string
  isToday: boolean
  status: WeekDayStatus
}

export type WeekStripProps = {
  days: WeekStripDayData[]
  selectedIndex: number
  onSelectDay: (index: number) => void
}
