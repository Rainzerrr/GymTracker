import type { WeekDayStatus } from '../../types/week-day-status'

export type NextWorkoutCardProps = {
  title: string
  durationMinutes: number
  exerciseCount: number
  imageUrl: string
  dateLabel: string
  streakCount: number
  status: WeekDayStatus
}
