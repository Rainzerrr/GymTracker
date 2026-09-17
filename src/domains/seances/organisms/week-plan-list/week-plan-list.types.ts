export type WeekPlanDayItem = {
  dayIndex: number
  dayName: string
  currentLabel: string
  isRestLike: boolean
  thumbnailUrl?: string
}

export type WeekPlanListProps = {
  days: WeekPlanDayItem[]
  onCycle: (dayIndex: number) => void
  onSave: () => void
}
