import type { WeekDayStatus } from '../../types/week-day-status'

export type WeekStripDayData = {
  index: number
  initial: string
  isToday: boolean
  status: WeekDayStatus
}

export type WeekStripProps = {
  days: WeekStripDayData[]
}
